

import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstants } from './auth_constants';
import { PassportStrategy } from '@nestjs/passport';
import { ActiveUserData } from './interface/active-user-data';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConstants.secret,
    } as any);
  }

  async validate(payload: ActiveUserData) {
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }
}
