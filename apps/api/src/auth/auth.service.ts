import { Token, TokenPayload } from '@app/common/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'utils/hashing';
import { CreateUserDto } from './dto/CreateUserDto';
import { PrismaService } from 'src/prisma.service';
import { admin } from 'src/firebase.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
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
      const payload: TokenPayload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };
      return this.createAuthResponse(user, payload);
    } else {
      throw new UnauthorizedException('Invalid password');
    }
  }

  async createToken(
    payload: TokenPayload,
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
    const { sub, username, role } =
      await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    return {
      userId: sub,
      token: await this.createToken(
        { sub, username, role },
        process.env.JWT_ACCESS_TOKEN_SECRET || '',
        process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
      ),
      role,
      type: 'Bearer',
      refreshToken: await this.createToken(
        { sub, username, role },
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
  async createAuthResponse(user: any, payload: TokenPayload): Promise<Token> {
    return {
      userId: user.id,
      token: await this.createToken(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET || '',
        process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
      ),
      type: 'Bearer',
      role: user.role,
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

  async singinWithGoogle(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email, name, picture } = decodedToken;

      let user = await this.prisma.user.findUnique({
        where: {
          username: email,
        },
      });

      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            name: name || user.name,
            avatar: picture || user.avatar,
            provider: 'GOOGLE',
          },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            username: email,
            name: name || email,
            avatar: picture || '',
            password: '',
            role: 'USER',
            provider: 'GOOGLE',
          },
        });
      }

      return this.createAuthResponse(user, {
        sub: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
