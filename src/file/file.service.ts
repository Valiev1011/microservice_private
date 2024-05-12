import { Injectable } from '@nestjs/common';
import { CreateFileRequest } from '../shared/file';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(@InjectRepository(File) private fileRepo: Repository<File>) {}
  async create(createFileDto: CreateFileRequest) {
    console.log(createFileDto);
    const file = await this.fileRepo.insert(createFileDto);
    return file.raw[0];
  }
}
