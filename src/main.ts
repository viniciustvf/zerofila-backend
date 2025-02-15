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

  // ✅ Configurar CORS corretamente
  expressApp.use(
    cors({
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

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

  // ✅ Definir prefixo global da API REST
  app.setGlobalPrefix('api');

  // ✅ Definir porta do servidor
  const port = configService.get<number>('NODE_API_PORT') || 3000;
  await app.listen(port, '0.0.0.0');

  // ✅ Configurar WebSocket (Socket.IO) corretamente **depois de iniciar**
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  // ✅ Melhorando os logs informativos
  const baseUrl = await app.getUrl();
  Logger.log(`🚀 API rodando em: ${baseUrl}/api`, 'Bootstrap');
  Logger.log(`📄 Swagger Docs: ${baseUrl}/docs`, 'Swagger');
  Logger.log(`🔌 WebSocket rodando em: ws://${baseUrl}/ws`, 'WebSocket');
  Logger.log(`🌍 Ambiente: ${configService.get<string>('NODE_ENV') || 'development'}`, 'Environment');
}

bootstrap();