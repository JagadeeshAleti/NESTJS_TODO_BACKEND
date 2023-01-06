import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    Logger.log('regisring user.....');
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      Logger.warn('Username is already taken, try with different one');
      throw new ConflictException(
        'User already exist, try with another email!',
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: hashedPwd,
    });
    const { id, username: userEmail } = newUser;
    Logger.log('User registered successfully');
    return { id, userEmail };
  }

  async signin(createUserDto: CreateUserDto) {
    Logger.log('user is logging in.......');
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      Logger.error('Incorrect email, try with different one');
      throw new NotFoundException('Incorrect email');
    }
    const { password: passwordFromDB } = user;

    const isValidUser = await bcrypt.compare(password, passwordFromDB);
    if (!isValidUser) {
      Logger.warn('Please check the password again');
      throw new UnauthorizedException('Incorrect password');
    }

    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
      expiresIn: '24h',
    });

    const refreshToken = jwt.sign(
      { username, code: 'This is refresh token ' },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '72h',
      },
    );
    Logger.log('User logged in successfully');
    return { accessToken: token, refreshToken };
  }
}
