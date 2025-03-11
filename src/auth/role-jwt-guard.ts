import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class RoleJwtGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  handleRequest<Tuser = any>(err: any, user: any): Tuser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role == 'ADMIN') {
      return user;
    }
    throw err || new UnauthorizedException();
  }
}
