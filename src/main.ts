import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new  RpcCustomExceptionFilter )

  await app.listen(envs.port);
  console.log('app running successfully')
  logger.log(`Gateway is running on: ${envs.port}`);
}
bootstrap();
