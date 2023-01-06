import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Headers,
  Param,
  UsePipes,
  UseGuards,
  ValidationPipe,
  UnauthorizedException,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGaurd } from 'src/gaurds/auth.gaurd';
import { CreateTodoDto } from './dto/CreateTodo.dto';
import { UpdateTodoDto } from './dto/UpdateTodo.dto';
import { TodoService } from './todo.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';

@Controller('todo')
@UseGuards(AuthGaurd)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createTodo(
    @Headers('authorization') token: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    try {
      return await this.todoService.createTodo(token, createTodoDto);
    } catch (err) {
      if (err?.driverError?.detail) {
        throw new UnauthorizedException('Invalid email user');
      }
      throw new NotFoundException("Useremail doesn't exists");
    }
  }

  @Get()
  async getAllTodo(@Headers('authorization') token: string) {
    return await this.todoService.fetchUserTodos(token);
  }

  @Get('/allTodos')
  async getAllTodosInDb(
    @Headers('authorization') token: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      page,
      limit,
    };
    return await this.todoService.fetchAllTodos(options, token);
  }

  @Get('/:id')
  async getTodoById(
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ) {
    return await this.todoService.fetchTodoById(token, id);
  }

  @Patch('/:id')
  async updateTodo(
    @Param('id') id: string,
    @Headers('authorization') token: string,
    @Body() updatedTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.updateTodo(id, token, updatedTodoDto);
  }

  @Delete('/:id')
  async deleteTodo(
    @Headers('authorization') token: string,
    @Param('id') id: string,
  ) {
    await this.todoService.deletedTodo(token, id);
  }
}
