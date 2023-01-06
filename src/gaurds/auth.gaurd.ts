import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGaurd implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    Logger.log("Authntecating user...")
    const request = context.switchToHttp().getRequest();
    const token = (request.headers as any)?.authorization;
    if (!token) {
      throw new NotFoundException('Token required');
    }
    let decode: JwtPayload;
    try {
      decode = jwt.verify(token, process.env.TOKEN_SECRET) as JwtPayload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('TOKEN_EXPIRED');
    }
  }
}
