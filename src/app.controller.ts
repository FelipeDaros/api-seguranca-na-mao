import { Body, Controller, Post } from '@nestjs/common';
import { AppService, IData, IDataMessage } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('centro-de-custo')
  public async sendPushNotifications(@Body() data: IData) {
    const { centroDecustoIds } = data;
    return await this.appService.sendPushNotifications({ centroDecustoIds });
  }

  @Post('enviar-todos-usuarios')
  public async sendPushNotificationsAll(
    @Body() data: IDataMessage,
  ): Promise<IDataMessage> {
    const { message, title } = data;
    return await this.appService.sendPushNotificationsAll({
      title,
      message,
    });
  }
}
