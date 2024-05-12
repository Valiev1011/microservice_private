import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { Auth } from './entities/auth.entity';
import {
  Course,
  Courses,
  DeleteUserCourseDto,
  GetMeDto,
  GetUserCourseDto,
  LoginDto,
  LogOutDto,
  LogOutMessage,
  SetCourseDto,
  SignUpDto,
  Tokens,
  User,
} from 'src/shared/auth';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private readonly courseService: CourseService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<Tokens> {
    const { login, password } = signUpDto;

    const exist = await this.authRepository.existsBy({
      login,
    });

    if (exist) {
      throw new RpcException({
        message: 'Already exists',
        code: grpc.status.ALREADY_EXISTS,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const user = (
      await this.authRepository
        .createQueryBuilder()
        .insert()
        .values({
          login,
          password: hashedPassword,
        })
        .returning('*')
        .execute()
    ).raw[0];

    const tokens = await this.getTokens(user);

    const dto = {
      key: `token_${user.id}`,
      value: tokens.accessToken,
    };

    await this.redisService.set(dto);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { login, password } = loginDto;
    const user = await this.authRepository.findOneBy({ login });

    if (!user) {
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'username or password is incorrect',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'username or password is incorrect',
      });
    }

    const tokens = await this.getTokens(user);

    const dto = {
      key: `token_${user.id}`,
      value: tokens.accessToken,
    };

    await this.redisService.set(dto);

    return tokens;
  }

  async getMe(getMeDto: GetMeDto): Promise<User> {
    const payload = await this.verifyToken(getMeDto);

    const user = await this.authRepository.findOneBy({
      login: payload.login,
    });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    return user;
  }

  async logout(logoutDto: LogOutDto): Promise<LogOutMessage> {
    const payload = await this.verifyToken(logoutDto);

    const user = await this.authRepository.existsBy({
      login: payload.login,
    });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: grpc.status.NOT_FOUND,
      });
    }

    await this.redisService.delete(`token_${payload.id}`);

    return { message: 'Logout successfully' };
  }

  async setUserCourse(payload: SetCourseDto): Promise<Course> {
    const { accessToken, courseId } = payload;
    const { id } = await this.verifyToken({ accessToken });
    const user = await this.authRepository.findOne({
      where: { id },
      relations: { courses: true },
    });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    const course = await this.courseService.findOne({ id: courseId });
    if (!course) {
      throw new RpcException({
        message: 'Course not found',
        code: grpc.status.NOT_FOUND,
      });
    }

    //@ts-ignore
    user.courses.push(course);

    await this.authRepository.save(user);
    return course;
  }

  async getUserCourses(payload: GetUserCourseDto): Promise<Courses> {
    const { accessToken } = payload;
    const { id } = await this.verifyToken({ accessToken });
    const user = await this.authRepository.findOne({
      where: { id },
      relations: {
        courses: true,
      },
    });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    return { courses: user.courses };
  }

  async deleteUserCourse(payload: DeleteUserCourseDto): Promise<Course> {
    const { accessToken, courseId } = payload;
    const { id } = await this.verifyToken({ accessToken });
    const user = await this.authRepository.findOne({
      where: { id },
      relations: {
        courses: true,
      },
    });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    const course = await this.courseService.findOne({ id: courseId });
    if (!course) {
      throw new RpcException({
        message: 'Course not found',
        code: grpc.status.NOT_FOUND,
      });
    }
    const userCourse = user.courses.findIndex(
      (val: Course) => val.id == course.id,
    );
    if (userCourse < 0) {
      throw new RpcException({
        message: 'User not enrolled to this Course',
        code: grpc.status.NOT_FOUND,
      });
    }
    user.courses.splice(userCourse, 1);
    await this.authRepository.save(user);

    return course;
  }

  async getTokens(user: User): Promise<Tokens> {
    const payload = {
      id: user.id,
      login: user.login,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: GetMeDto) {
    try {
      console.log(token);
      const payload = await this.jwtService.verify(token.accessToken, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      const redisToken = await this.redisService.get(`token_${payload.id}`);
      if (!redisToken || redisToken !== token.accessToken) {
        throw new RpcException({
          message: 'Unauthenticated User',
          code: grpc.status.UNAUTHENTICATED,
        });
      }
      return payload;
    } catch (error) {
      throw new RpcException({
        message: 'Unauthenticated User',
        code: grpc.status.UNAUTHENTICATED,
      });
    }
  }
}
