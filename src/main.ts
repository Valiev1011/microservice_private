import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50000',
        package: ['auth', 'course'],
        protoPath: [
          join(__dirname, '../protos/auth.proto'),
          join(__dirname, '../protos/course.proto'),
        ],
      },
    },
  );
  await app.listen();
}
bootstrap();
