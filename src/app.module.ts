import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { UrlsModule } from './urls/urls.module';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [MailerModule.forRoot(mailerConfig), AuthModule, UserModule, UrlsModule, RedirectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
