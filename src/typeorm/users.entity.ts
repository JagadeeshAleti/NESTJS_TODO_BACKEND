import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;
}
