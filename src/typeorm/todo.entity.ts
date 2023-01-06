import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('todo')
export class Todo {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  status: string;

  @Column()
  title: string;
}
