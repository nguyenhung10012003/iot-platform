import { Token } from '@app/common/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'utils/hashing';
import { CreateUserDto } from './dto/CreateUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Find user by username and validate password
   * @param username - the username of the user
   * @param password - the password of the user
   * @returns {Token} - a Token model
   */
  async validateUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<Token> {
    const user = await this.userService.findOne(username, {
      throwIfNotFound: true,
    });
    const isValidPassword = await comparePassword(password, user.password);
    if (isValidPassword) {
      const payload = { sub: user.id, username: user.username };
      return this.createAuthResponse(user, payload);
    } else {
      throw new UnauthorizedException('Invalid password');
    }
  }

  async createToken(
    payload: any,
    secretkey: string,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { secret: secretkey, expiresIn });
  }

  /**
   * Validate refresh token
   * @param token
   * @returns a Token model
   */
  async validateRefreshToken(token: string): Promise<Token> {
    const { sub, username } = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    return {
      userId: sub,
      token: await this.createToken(
        { sub, username },
        process.env.JWT_ACCESS_TOKEN_SECRET || '',
        process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
      ),
      type: 'Bearer',
      refreshToken: await this.createToken(
        { sub, username },
        process.env.JWT_REFRESH_TOKEN_SECRET || '',
        process.env.JWT_REFRESH_TOKEN_EXPIRE || '',
      ),
      issuedAt: new Date(),
      expireAt: new Date(
        Date.now() + ms(process.env.JWT_ACCESS_TOKEN_EXPIRE || ''),
      ),
    };
  }

  /**
   * Create auth response for user
   * @param user user object
   * @param payload payload object
   * @returns a Token model
   */
  async createAuthResponse(
    user: any,
    payload: { sub: string; username: string },
  ) {
    return {
      userId: user.id,
      token: await this.createToken(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET || '',
        process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
      ),
      type: 'Bearer',
      refreshToken: await this.createToken(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET || '',
        process.env.JWT_REFRESH_TOKEN_EXPIRE || '',
      ),
      issuedAt: new Date(),
      expireAt: new Date(
        Date.now() + ms(process.env.JWT_ACCESS_TOKEN_EXPIRE || ''),
      ),
    };
  }

  async signin(data: { username: string; password: string }) {
    return this.validateUser(data);
  }

  async signup(data: CreateUserDto) {
    const user = await this.userService.createUser(data);
    if (user) return this.validateUser(data);
    return null;
  }
}
