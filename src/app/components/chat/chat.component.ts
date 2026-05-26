import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      text:
        '👋 Hi! I can answer questions using live public data. Try asking:\n\n' +
        '- 🌍 **Country info** — *"Tell me about Japan"* or *"Capital of Brazil?"*\n' +
        '- 🌤 **Weather** — *"What\'s the weather in London?"*\n' +
        '- 🎯 **Trivia** — *"Give me a science trivia question"*\n' +
        '- 🔍 **GitHub PR Review** — *"Review PR owner/repo#42"* or paste a GitHub PR URL',
      timestamp: new Date(),
    },
  ]);

  input = '';
  loading = signal(false);

  constructor(private readonly chatService: ChatService) {}

  send(): void {
    const text = this.input.trim();
    if (!text || this.loading()) return;

    this.messages.update((msgs) => [
      ...msgs,
      { role: 'user', text, timestamp: new Date() },
    ]);
    this.input = '';
    this.loading.set(true);
    this.scrollToBottom();

    this.chatService.sendMessage(text).subscribe({
      next: (res) => {
        this.messages.update((msgs) => [
          ...msgs,
          { role: 'assistant', text: res.reply, timestamp: new Date() },
        ]);
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            text: '⚠️ Could not reach the chat server. Make sure the MCP server is running on port 3001.',
            timestamp: new Date(),
          },
        ]);
        this.loading.set(false);
        this.scrollToBottom();
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }
}
