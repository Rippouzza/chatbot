import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  id?: number;
  sender: 'user' | 'bot';
  content: string;
  type?: 'text' | 'visualization';
}

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent {
  messages: Message[] = [
    { sender: 'bot', content: 'Hello! How can I help you today?', type: 'text' }
  ];
  userInput: string = '';
  private messageIdCounter = 0;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
    const userQuestion = this.userInput;
    this.messages.push({ sender: 'user', content: userQuestion, type: 'text' });

    this.http.post<any>('http://localhost:5000/api/nl-to-sql', { question: userQuestion })
      .subscribe({
        next: (response) => {
          // Visualization first, then explanation
          let vizId: number | undefined = undefined;
          if (response?.plotly_code) {
            vizId = this.messageIdCounter++;
            this.messages.push({ id: vizId, sender: 'bot', content: '', type: 'visualization' });
            setTimeout(() => this.renderPlotly(vizId!, response.plotly_code), 0);
          }
          const explanation = response?.explanation || 'No explanation provided.';
          this.messages.push({ sender: 'bot', content: explanation, type: 'text' });
        },
        error: () => {
          this.messages.push({ sender: 'bot', content: 'Error contacting backend.', type: 'text' });
        }
      });

    this.userInput = '';
  }

  async renderPlotly(id: number, plotlyCode: string) {
    const container = document.getElementById('plotly-container-' + id);
    if (plotlyCode && container) {
      const Plotly = (await import('plotly.js-dist-min')).default;
      // eslint-disable-next-line no-eval
      const plotlyFunc = new Function('Plotly', 'container', plotlyCode);
      plotlyFunc(Plotly, container);
    }
  }
}