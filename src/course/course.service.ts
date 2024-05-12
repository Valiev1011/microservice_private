import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Course as ICourse,
  Courses,
  CreateCourseDto,
  DeleteMessage,
  OneDto,
  Pagination,
  UpdateCourseDto,
} from 'src/shared/course';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<ICourse> {
    const { title } = createCourseDto;
    const exists = await this.courseRepository.existsBy({ title });
    if (exists) {
      throw new RpcException({
        message: 'Course exists',
        code: grpc.status.ALREADY_EXISTS,
      });
    }
    const course = await this.courseRepository.insert(createCourseDto);
    return course.raw[0];
  }

  async findAll(pagination: Pagination): Promise<Courses> {
    let { page, limit } = pagination;
    const skip = isNaN(+page) || +page < 1 ? 1 : +page;
    const take = isNaN(+limit) || +limit < 1 ? 20 : +limit;

    const courses = await this.courseRepository.find({
      skip: (skip - 1) * take,
      take,
    });
    return { courses };
  }

  async findOne(payload: OneDto): Promise<ICourse> {
    const { id } = payload;

    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new RpcException({
        message: 'Course not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    return course;
  }

  async update(updateCourseDto: UpdateCourseDto): Promise<ICourse> {
    const { id, title } = updateCourseDto;

    const oldCourseId = await this.courseRepository.findOneBy({ id });
    const oldCourseTitle = await this.courseRepository.findOneBy({ title });
    if (!oldCourseId) {
      throw new RpcException({
        message: 'Course not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    if (oldCourseTitle && oldCourseTitle.id !== oldCourseId.id) {
      if (!oldCourseId) {
        throw new RpcException({
          message: 'Course exists',
          code: grpc.status.ALREADY_EXISTS,
        });
      }
    }

    const updatedCourse = await this.courseRepository.save(updateCourseDto);

    return updatedCourse;
  }

  async remove(payload: OneDto): Promise<DeleteMessage> {
    const { id } = payload;
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new RpcException({
        message: 'Course not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    await this.courseRepository.remove(course);
    return { message: 'delete success' };
  }
}
