import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Skinsight API')
    .setDescription('Skinsight API description')
    .setVersion('1.0')
    .addTag('skinsight')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    })
  );
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8000'],
    credentials: true,
  });

  // somewhere in your initialization file

  await app.listen(3000);
}
bootstrap();
