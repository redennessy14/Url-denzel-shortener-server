import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  getByRegisterLink(registerLink: string) {
    return this.prisma.user.findUnique({
      where: {
        registerLink,
      },
    });
  }

  async create(dto: AuthDto, registerLinkToken: string) {
    const user = {
      email: dto.email,
      name: '',
      password: await hash(dto.password),
      registerLink: registerLinkToken,
    };

    return this.prisma.user.create({
      data: user,
    });
  }

  async confirm(id: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      select: {
        name: true,
        email: true,
        isActive: true,
      },
    });
  }
}
