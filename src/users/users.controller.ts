import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Post('sign-in')
  @UsePipes(ValidationPipe)
  signin(@Body() createUserDto: CreateUserDto) {
    return this.userService.signin(createUserDto);
  }
}
