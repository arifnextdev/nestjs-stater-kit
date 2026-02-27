import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ||
        'http://localhost:8000/api/v1/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'photos'],
      scope: ['email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    const { id, emails, name, photos } = profile;

    const user = {
      id,
      email: emails?.[0]?.value,
      name: name?.givenName + ' ' + name?.familyName,
      picture: photos?.[0]?.value,
      provider: 'facebook',
    };

    done(null, user);
  }
}
