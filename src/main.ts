import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api',{
    exclude: [{ 
      path: 'health-check',
      method: RequestMethod.GET,
    }]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new  RpcCustomExceptionFilter )

  await app.listen(envs.port);
  console.log('Health check setted')
  logger.log(`Gateway is running on PORT: ${envs.port}`);
}
bootstrap();
