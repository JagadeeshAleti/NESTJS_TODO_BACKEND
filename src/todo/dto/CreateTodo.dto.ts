import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;
}
