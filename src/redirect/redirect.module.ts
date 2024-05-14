import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectController } from './redirect.controller';
import { UrlsService } from 'src/urls/urls.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [RedirectController],
  providers: [RedirectService, UrlsService, PrismaService, UserService],
})
export class RedirectModule {}
