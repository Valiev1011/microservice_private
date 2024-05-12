import { Controller } from '@nestjs/common';
import { FileService } from './file.service';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CreateFileRequest, FILE_SERVICE_NAME } from '../shared/file';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @GrpcMethod(FILE_SERVICE_NAME, 'createFile')
  create(@Payload() createFileDto: CreateFileRequest) {
    console.log(createFileDto);
    return this.fileService.create(createFileDto);
  }
}
