import { Course } from 'src/course/entities/course.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @ManyToMany(() => Course, (course: Course) => course.users)
  @JoinTable()
  courses: Course[];
}
