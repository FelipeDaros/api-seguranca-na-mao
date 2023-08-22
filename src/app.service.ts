import { BadRequestException, Injectable } from '@nestjs/common';
import { Client } from 'onesignal-node';

export interface IData {
  centroDecustoIds: string[];
}

export interface IDataMessage {
  title: string;
  message: string;
}

@Injectable()
export class AppService {
  private client: Client;
  constructor() {
    this.client = new Client(
      process.env.ONE_SIGNAL_APP_ID,
      process.env.ONE_SIGNAL_REST_API_KEY
    );
  }

  public async sendPushNotifications({
    centroDecustoIds,
  }: IData): Promise<void> {
    for await (const centroDecustoId of centroDecustoIds) {
      const filters = [
        {
          field: 'tag',
          key: centroDecustoId,
          relation: '=',
          value: centroDecustoId,
        },
      ];

      await this.client.createNotification({
        headings: { en: 'Há uma nova solicitação para aprovar!' },
        contents: {
          en: 'Foi efetuado uma nova solicitação para o centro de custo, por favor verificar',
        },
        filters: filters,
      });
    }
  }

  public async sendPushNotificationsAll({
    message,
    title,
  }: IDataMessage): Promise<IDataMessage> {
    try {
      await this.client.createNotification({
        headings: { en: title },
        contents: { en: message },
        included_segments: ['All'],
      });

      return { message, title };
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
