import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  AUTH_SERVICE_NAME,
  DeleteUserCourseDto,
  GetMeDto,
  GetUserCourseDto,
  LogOutDto,
  LoginDto,
  SetCourseDto,
  SignUpDto,
} from '../shared/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'signup')
  create(@Payload() createAuthDto: SignUpDto) {
    return this.authService.signup(createAuthDto);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'login')
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'getMe')
  getMe(@Payload() getMeDto: GetMeDto) {
    return this.authService.getMe(getMeDto);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'logout')
  logout(@Payload() logoutDto: LogOutDto) {
    return this.authService.logout(logoutDto);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'setUserCourse')
  setUserCourse(@Payload() setCourseDto: SetCourseDto) {
    return this.authService.setUserCourse(setCourseDto);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'getUserCourses')
  getUserCourses(@Payload() getCourseDto: GetUserCourseDto) {
    return this.authService.getUserCourses(getCourseDto);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'deleteUserCourse')
  deleteUserCourse(@Payload() deleteCourseDto: DeleteUserCourseDto) {
    return this.authService.deleteUserCourse(deleteCourseDto);
  }
}
