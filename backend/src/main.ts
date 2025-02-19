import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EstacionamentoService } from './estacionamento/estacionamento.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativando CORS para permitir requisições de qualquer origem
  app.enableCors({
    origin: '*', // Permite todas as origens
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Estacionamento') // Título da documentação Swagger
    .setDescription(
      'Documentação da API para gerenciamento de estacionamentos, com autenticação e autorização JWT.',
    ) // Descrição
    .setVersion('1.0') // Versão da API
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token JWT para acessar as rotas protegidas',
    }) // Suporte para autenticação Bearer
    .build();

  // Criação do documento Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Configuração da rota da documentação (http://localhost:3000/api/docs)
  SwaggerModule.setup('api/docs', app, document); // 🔥 Corrigida a URL para /api/docs

  // Escutando no IP da máquina para acesso em rede local
  await app.listen(3000, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://192.168.0.15:3000/`); // Substitua '192.168.0.15' pelo IP da sua máquina
    console.log(
      `📚 Documentação do Swagger disponível em http://192.168.0.15:3000/api/docs`,
    );
  });
}
bootstrap();
