import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { configureAuthSwaggerDocs } from './helpers/configure-auth-swagger-docs.helper';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
import express from 'express';
import cors from 'cors';

async function bootstrap() {
  const expressApp = express(); // Criando uma instância do Express
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const configService = app.get<ConfigService>(ConfigService);

  // ✅ Configurar CORS
  expressApp.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // ✅ Configurar WebSocket (Socket.IO) corretamente com CORS
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  // ✅ Definir prefixo global da API REST
  app.setGlobalPrefix('api');

  // ✅ Configurar validações globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Configurar Swagger (Documentação da API)
  configureAuthSwaggerDocs(app, configService);
  configureSwaggerDocs(app, configService);

  // ✅ Definir porta do servidor (API + WebSocket)
  const port = configService.get<number>('NODE_API_PORT') || 3000;
  await app.listen(port, '0.0.0.0');

  // ✅ Logs informativos
  if (configService.get<string>('NODE_ENV') !== 'production') {
    Logger.debug(`${await app.getUrl()} - Environment: ${configService.get<string>('NODE_ENV')}`, 'Environment');
    Logger.debug(`Swagger API: ${await app.getUrl()}/docs`, 'Swagger');
    Logger.debug(`WebSocket rodando em ws://localhost:${port}/ws`, 'WebSocket');
  }
}

bootstrap();

export default express();