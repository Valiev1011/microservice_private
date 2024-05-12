import { Auth } from 'src/auth/entities/auth.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { File } from '../../file/entities/file.entity';

@Entity({ name: 'course' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => File, (file: File) => file.courses)
  files: File[];

  @ManyToMany(() => Auth, (auth: Auth) => auth.courses)
  users: Auth[];
}
