import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todos, Users } from 'src/typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todos, Users])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
