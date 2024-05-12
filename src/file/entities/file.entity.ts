import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { File as IFile } from '../../shared/file';

@Entity({ name: 'file' })
export class File implements IFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  filePath: string;

  @ManyToMany(() => Course, (course: Course) => course.files, { cascade: true })
  @JoinTable()
  courses: Course[];
}
