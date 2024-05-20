import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsDto } from './dto/urls.dto';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Response } from 'express';

@Controller('urls')
export class UrlsController {
  constructor(private urlsService: UrlsService) {}

  @Get()
  @HttpCode(200)
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.urlsService.getAll(userId);
  }

  @Get(':id')
  @HttpCode(200)
  @Auth()
  async getOne(@Param('id') id: string) {
    return this.urlsService.getOne(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async create(@Body() dto: UrlsDto, userId?: string) {
    return this.urlsService.create(dto, userId);
  }

  @Patch(':id')
  @Auth()
  async update(@Body() dto: UrlsDto, @Param('id') id: string) {
    return this.urlsService.update(dto, id);
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string) {
    return this.urlsService.delete(id);
  }

  @UsePipes(new ValidationPipe())
  @Get(':id/qr')
  // @Auth()
  async getQr(@Param('id') id: string, @Res() res: Response) {
    const imagePath = await this.urlsService.getQr(id);
    if (!imagePath) {
      res.status(404).send('QR не найден');
      return;
    }
    res.sendFile(imagePath);
  }
}
