import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.mail.ru',
    port: 587,
    secure: false,
    auth: {
      user: 'shortenerdenzel@mail.ru',
      pass: 'HAZ3Y6wzE9bmarVL5EBL',
    },
  },
  defaults: {
    from: '"Url shortner" <shortenerdenzel@mail.ru>',
  },
  template: {
    dir: `${process.cwd()}/src/templates`,
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
