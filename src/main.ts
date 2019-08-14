import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './app/common/config/config.service';
import { HttpExceptionFilter } from './app/common/error-manager/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);

  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET_KEY;
  const scopes = 'write_products';
  const forwardingAddress = 'write_products';

  app.setGlobalPrefix('/api/' + configService.get('APP_VERSION'));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
