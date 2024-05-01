import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SkinImagesModule } from './skin-images/skin-images.module';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MessagesModule } from './messages/messages.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    SkinImagesModule,
    AiAnalysisModule,
    ConsultationsModule,
    AppointmentsModule,
    MessagesModule,
    DocumentsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}