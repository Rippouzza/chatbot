import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatInterfaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chatbot';
}
