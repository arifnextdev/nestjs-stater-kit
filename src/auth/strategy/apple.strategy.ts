import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID || '',
      teamID: process.env.APPLE_TEAM_ID || '',
      keyID: process.env.APPLE_KEY_ID || '',
      privateKeyString: (process.env.APPLE_PRIVATE_KEY || '').replace(
        /\\n/g,
        '\n',
      ),
      callbackURL:
        process.env.APPLE_CALLBACK_URL ||
        'http://localhost:8000/api/v1/auth/apple/callback',
      scope: ['email', 'name'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    idToken: any,
    profile: any,
    done: Function,
  ): Promise<any> {
    const user = {
      id: idToken.sub,
      email: idToken.email,
      name: `${idToken.firstName ?? ''} ${idToken.lastName ?? ''}`.trim(),
      provider: 'apple',
    };

    done(null, user);
  }
}
