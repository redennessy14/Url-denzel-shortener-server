import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Response, Request } from 'express';

@Controller()
export class RedirectController {
  constructor(private redirectService: RedirectService) {}

  @Get(':shortLink')
  async redirect(@Param('shortLink') shortLink: string, @Req() req: Request) {
    const ipAddress = req.ip;
    return this.redirectService.redirect(shortLink, ipAddress);
  }
}
