import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todos } from 'src/typeorm';
import { Users } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/CreateTodo.dto';
import { UpdateTodoDto } from './dto/UpdateTodo.dto';
import * as jwt from 'jsonwebtoken';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
import { Pagination } from 'nestjs-typeorm-paginate';

interface JwtPayload {
  username: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todos) private readonly todoRepository: Repository<Todos>,
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async userExists(token: string) {
    Logger.log('Checking the user existed in db...');
    const { username } = jwt.decode(token) as JwtPayload;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      Logger.error('No user found with this email');
      throw new NotFoundException("Useremail doesn't exists");
    }
  }

  async createTodo(token: string, createTodoDto: CreateTodoDto) {
    await this.userExists(token);
    Logger.log('Creating todo for the user');
    const { username } = jwt.decode(token) as JwtPayload;
    const todo = await this.todoRepository.save({
      ...createTodoDto,
      username,
    });
    Logger.log('Todo created successfully');
    return todo;
  }

  async fetchUserTodos(token: string) {
    await this.userExists(token);
    Logger.log('Fetching all todos for the user....');
    const { username } = jwt.decode(token) as JwtPayload;
    const todos = await this.todoRepository.findBy({ username });
    Logger.log('All tods fetched successfully');
    return { todos };
  }

  async fetchAllTodos(
    options: IPaginationOptions,
    token: string,
  ): Promise<Pagination<Todos>> {
    await this.userExists(token);
    Logger.log('Fetching all todos frmo db, please wait moment');
    const qb = this.todoRepository.createQueryBuilder('q');
    qb.orderBy('q.id', 'DESC');
    return paginate<Todos>(qb, options);
  }

  async fetchTodoById(token: string, id: string) {
    await this.userExists(token);
    Logger.log(`Fetching todo with the id : ${id}`);
    const todo = await this.todoRepository.findOneBy({ id });
    Logger.log('Todo fetched successfully');
    return { todo };
  }

  async updateTodo(id: string, token: string, updatedTodoDto: UpdateTodoDto) {
    await this.userExists(token);
    Logger.log(`Updating todo with the id : ${id}`);
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException('No Todo exists with this id');
    await this.todoRepository.save({ ...todo, ...updatedTodoDto });
    const updatedTodo = await this.todoRepository.findOneBy({ id });
    Logger.log('Todo updated successfully');
    return { updatedTodo };
  }

  async deletedTodo(token: string, id: string) {
    await this.userExists(token);
    Logger.log(`Deleting todo with the id : ${id}`);
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException('No Todo exists with this id');
    await this.todoRepository.delete({ id });
    Logger.log('Todo deleted successfully');
    return { msg: 'Todo deleted successfully' };
  }
}

// user not existed
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphZ2FlZXNoLmFsZXRpOTUxNTFAZ21haWwuY29tIiwiaWF0IjoxNjcyNjM4Mzg5LCJleHAiOjE2NzI3MjQ3ODl9.MOLndeIob0JxD1-f881XC_yREecsKEC_lBcmAc3lFw8
