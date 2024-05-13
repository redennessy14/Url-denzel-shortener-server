import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { verify } from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(dto: AuthDto) {
    const { password, registerLink, ...user } = await this.validateUser(dto);

    if (user.isActive == false)
      throw new BadRequestException('Пользователь не активен');

    const token = this.issueTokens(user.id);

    return {
      user,
      ...token,
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);

    if (oldUser) throw new BadRequestException('Пользователь уже существует');

    const registerLinkToken = this.issueRegisterToken();

    const { password, registerLink, ...user } = await this.userService.create(
      dto,
      registerLinkToken,
    );

    await this.sendRegistrationEmail(dto.email, registerLinkToken);

    const token = this.issueTokens(user.id);

    return {
      user,
      ...token,
    };
  }

  private issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private issueRegisterToken() {
    const registerToken = this.jwt.sign({}, { expiresIn: '5m' });
    return registerToken;
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) throw new NotFoundException('Пользователь не найдет');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Неверный пароль или логин');

    return user;
  }

  private async sendRegistrationEmail(
    email: string,
    registerLink: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Url Denzel Shortener Registration Link',
        template: 'register',
        context: {
          registerLink,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка работы почты: ${JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirm(registerLink: string) {
    try {
      const user = await this.userService.getByRegisterLink(registerLink);

      if (!user) throw new NotFoundException('Пользователь не найден');

      if (user.isActive == true)
        throw new BadRequestException('Пользователь уже подтвержден');

      this.jwt.verify(registerLink);

      user.isActive = true;
      await this.userService.update(user.id, user);
      return 'Аккаунт успешно активирован';
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Ссылка устарела');
      }
      throw error;
    }
  }
}
