import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { ContactForm } from '../../data/contact';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected formData = signal<ContactForm>({
    name: '',
    email: '',
    message: '',
    website: '',
  });

  protected isSubmitting = signal(false);
  protected submitStatus = signal<'idle' | 'success' | 'error'>('idle');
  protected errorMessage = signal('');

  // Discord webhook URL (will be exposed in client, that's okay for now)
  private readonly DISCORD_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL_HERE';

  async onSubmit(event: Event) {
    event.preventDefault();

    const data = this.formData();

    // Honeypot check
    if (data.website) {
      console.log('Bot detected via honeypot');
      return;
    }

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      this.errorMessage.set('Por favor, preencha todos os campos');
      this.submitStatus.set('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.errorMessage.set('Por favor, insira um email válido');
      this.submitStatus.set('error');
      return;
    }

    this.isSubmitting.set(true);
    this.submitStatus.set('idle');
    this.errorMessage.set('');

    try {
      const discordMessage = {
        embeds: [{
          title: '📧 Nova Mensagem do Portfólio',
          color: 0xF37F1C, // Orange color
          fields: [
            {
              name: '👤 Nome',
              value: data.name,
              inline: true,
            },
            {
              name: '📧 Email',
              value: data.email,
              inline: true,
            },
            {
              name: '💬 Mensagem',
              value: data.message,
            },
          ],
          timestamp: new Date().toISOString(),
        }],
      };

      const response = await fetch(this.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Success
      this.submitStatus.set('success');
      this.formData.set({
        name: '',
        email: '',
        message: '',
        website: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        this.submitStatus.set('idle');
      }, 5000);

    } catch (error) {
      console.error('Error sending message:', error);
      this.errorMessage.set('Erro ao enviar mensagem. Tente novamente.');
      this.submitStatus.set('error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  updateFormData(field: keyof ContactForm, value: string) {
    this.formData.update(data => ({
      ...data,
      [field]: value,
    }));
  }
}
