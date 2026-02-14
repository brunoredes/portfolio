import { Injectable } from '@angular/core';
import type { ContactFormData, DiscordMessage } from './contact';

@Injectable({
  providedIn: 'root',
})
export class ContactHandler {
  private readonly WEBHOOK_URL = '';

  /**
   * Sends contact form data to Discord webhook
   * @param data Contact form data
   * @throws Error if webhook request fails
   */
  async send(data: ContactFormData): Promise<void> {
    const message = this.formatMessage(data);

    const response = await fetch(this.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Formats contact form data into Discord message format
   * @param data Contact form data
   * @returns Discord message object
   */
  private formatMessage(data: ContactFormData): DiscordMessage {
    return {
      embeds: [{
        title: '📧 Nova Mensagem do Portfólio',
        color: 0xF37F1C, // Orange color (#F37F1C)
        fields: [
          {
            name: '👤 Nome',
            value: this.escapeDiscordMarkdown(data.name),
            inline: true,
          },
          {
            name: '💬 Mensagem',
            value: this.escapeDiscordMarkdown(data.message),
          },
        ],
        timestamp: new Date().toISOString(),
      }],
    };
  }

  /**
   * Escapes Discord markdown characters to prevent formatting issues
   * @param text Text to escape
   * @returns Escaped text
   */
  private escapeDiscordMarkdown(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\*/g, '\\*')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`')
      .replace(/\|/g, '\\|');
  }
}
