import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CourseService } from './course.service';
import {
  COURSE_SERVICE_NAME,
  CreateCourseDto,
  OneDto,
  Pagination,
  UpdateCourseDto,
} from 'src/shared/course';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @GrpcMethod(COURSE_SERVICE_NAME, 'create')
  create(@Payload() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'getAll')
  findAll(@Payload() pagination: Pagination) {
    return this.courseService.findAll(pagination);
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'getOne')
  findOne(@Payload() payload: OneDto) {
    return this.courseService.findOne(payload);
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'update')
  update(@Payload() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(updateCourseDto);
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'delete')
  remove(@Payload() payload: OneDto) {
    return this.courseService.remove(payload);
  }
}
