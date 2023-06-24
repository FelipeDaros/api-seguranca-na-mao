import { Injectable } from '@nestjs/common';
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
    this.client = new Client(process.env.APPID, process.env.RESTAPIKEY);
  }

  public async sendPushNotifications({
    centroDecustoIds,
  }: IData): Promise<void> {
    for await (const centroDecustoId of centroDecustoIds) {
      await this.client.createNotification({
        headings: { en: 'Há uma nova solicitação para aprovar!' },
        contents: {
          en: 'Foi efetuado uma nova solicitação para o centro de custo, por favor verificar',
        },
        filters: [
          {
            field: 'tag',
            key: centroDecustoId,
            relation: '=',
            value: centroDecustoId,
          },
        ],
      });
    }

    return;
  }

  public async sendPushNotificationsAll({
    message,
    title,
  }: IDataMessage): Promise<IDataMessage> {
    await this.client.createNotification({
      headings: { en: title },
      contents: { en: message },
      included_segments: ['All'],
    });

    return { message, title };
  }
}
