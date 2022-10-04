import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/config.module';
import { ConfigService } from './shared/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config
  const configService = app.select(SharedModule).get(ConfigService);

  // Setup swagger
  const options = new DocumentBuilder().setTitle('API Document').setVersion('1.0').addServer(configService.swaggerPath).addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  
  await app.listen(configService.port);
  console.log(`Server is listen on port ${configService.port}`)
}
bootstrap();
