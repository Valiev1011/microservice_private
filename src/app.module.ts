import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourseOptions } from './database/data.source';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from './file/file.module';
console.log(dataSourseOptions);
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRoot(dataSourseOptions),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    CourseModule,
    RedisModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
