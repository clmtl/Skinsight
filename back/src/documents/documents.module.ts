import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientDocument } from './entities/document.entity';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
    imports: [TypeOrmModule.forFeature([PatientDocument])],
    controllers: [DocumentsController],
    providers: [DocumentsService] 
})
export class DocumentsModule {}
