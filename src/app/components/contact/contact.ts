import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { ContactForm, ContactFormData } from '../../data/contact';

import { ContactHandler } from '../../data/contact-handler';

interface FieldErrors {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private contactHandler: ContactHandler = inject(ContactHandler);
  protected formData = signal<ContactForm>({
    name: '',
    email: '',
    message: '',
    website: '', // honeypot
  });

  protected isSubmitting = signal(false);
  protected submitStatus = signal<'idle' | 'success' | 'error'>('idle');
  protected fieldErrors = signal<FieldErrors>({
    name: '',
    email: '',
    message: '',
  });
  protected touchedFields = signal<Set<keyof ContactFormData>>(new Set());

  async onSubmit(event: Event) {
    event.preventDefault();

    const data = this.formData();

    // Honeypot check - silent fail for bots
    if (data.website) {
      console.log('Bot detected via honeypot');
      return;
    }

    // Mark all fields as touched
    this.touchedFields.set(new Set(['name', 'email', 'message']));

    // Validate all fields
    const errors = this.validateAllFields(data);

    if (errors.name || errors.email || errors.message) {
      this.fieldErrors.set(errors);
      this.submitStatus.set('error');
      return;
    }

    this.isSubmitting.set(true);
    this.submitStatus.set('idle');
    this.fieldErrors.set({ name: '', email: '', message: '' });

    try {
      // Delegate to service
      await this.contactHandler.send({
        name: data.name,
        email: data.email,
        message: data.message,
      });

      // Success
      this.submitStatus.set('success');
      this.resetForm();

      // Reset success message after 10 seconds (longer for screen readers)
      setTimeout(() => {
        this.submitStatus.set('idle');
      }, 10000);

    } catch (error) {
      console.error('Error sending message:', error);
      this.fieldErrors.set({
        name: '',
        email: '',
        message: 'Erro ao enviar mensagem. Tente novamente.',
      });
      this.submitStatus.set('error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Handle field blur - validate on blur
   */
  onFieldBlur(field: keyof ContactFormData) {
    // Mark field as touched
    this.touchedFields.update(touched => {
      const newTouched = new Set(touched);
      newTouched.add(field);
      return newTouched;
    });

    // Validate only this field
    const data = this.formData();
    const currentErrors = this.fieldErrors();
    const fieldError = this.validateField(field, data[field]);

    this.fieldErrors.set({
      ...currentErrors,
      [field]: fieldError,
    });
  }

  /**
   * Update form data
   */
  updateFormData(field: keyof ContactForm, value: string) {
    this.formData.update(data => ({
      ...data,
      [field]: value,
    }));

    // Clear error when user starts typing (if field was touched)
    if (this.touchedFields().has(field as keyof ContactFormData)) {
      const currentErrors = this.fieldErrors();
      this.fieldErrors.set({
        ...currentErrors,
        [field]: '',
      });
    }
  }

  /**
   * Validate a single field
   */
  private validateField(field: keyof ContactFormData, value: string): string {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'Nome é obrigatório';
        }
        if (value.trim().length < 2) {
          return 'Nome deve ter pelo menos 2 caracteres';
        }
        return '';

      case 'email':
        if (!value.trim()) {
          return 'Email é obrigatório';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Email inválido';
        }
        return '';

      case 'message':
        if (!value.trim()) {
          return 'Mensagem é obrigatória';
        }
        if (value.trim().length < 10) {
          return 'Mensagem deve ter pelo menos 10 caracteres';
        }
        return '';

      default:
        return '';
    }
  }

  /**
   * Validate all fields
   */
  private validateAllFields(data: ContactForm): FieldErrors {
    return {
      name: this.validateField('name', data.name),
      email: this.validateField('email', data.email),
      message: this.validateField('message', data.message),
    };
  }

  /**
   * Check if field has error and was touched
   */
  protected hasFieldError(field: keyof FieldErrors): boolean {
    return this.touchedFields().has(field) && !!this.fieldErrors()[field];
  }

  /**
   * Get error message for field
   */
  protected getFieldError(field: keyof FieldErrors): string {
    return this.fieldErrors()[field];
  }

  private resetForm() {
    this.formData.set({
      name: '',
      email: '',
      message: '',
      website: '',
    });
    this.fieldErrors.set({ name: '', email: '', message: '' });
    this.touchedFields.set(new Set());
  }
}
