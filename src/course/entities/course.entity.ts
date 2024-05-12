import { Auth } from 'src/auth/entities/auth.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'course' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => Auth, (auth: Auth) => auth.courses)
  users: Auth[];
}
