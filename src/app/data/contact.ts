export interface ContactForm {
  name: string;
  message: string;
  subject: string;
  website: string;
}

export interface ContactFormData {
  name: string;
  message: string;
  subject: string;
}

interface DiscordEmbed {
  title: string;
  color: number;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp: string;
}

export interface DiscordMessage {
  embeds: DiscordEmbed[];
}
