import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlsDto } from './dto/urls.dto';
import { PrismaService } from 'src/prisma.service';
import * as shortid from 'shortid';
import { UserService } from 'src/user/user.service';
import qrImage = require('qr-image');
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class UrlsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getAll(userId: string) {
    return this.prisma.url.findMany({
      where: {
        userId,
      },
    });
  }

  async getOne(id: string) {
    return this.prisma.url.findUnique({
      where: {
        id,
      },
    });
  }

  async getLink(shortLink: string) {
    return this.prisma.url.findUnique({
      where: {
        shortLink: shortLink,
      },
    });
  }

  async create(dto: UrlsDto, userId?: string) {
    const shortLink = shortid.generate();

    const data: any = {
      ...dto,
      shortLink: `${shortLink}`,
    };

    if (userId) {
      data.user = { connect: { id: userId } };
    }

    return this.prisma.url.create({
      data: data,
    });
  }

  async update(dto: Partial<UrlsDto>, id: string) {
    return this.prisma.url.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async updateStatistics(id: string, ipAddress: string) {
    const url = await this.getOne(id);
    const updatedUniqueUsers = url.uniqueUsers.includes(ipAddress)
      ? url.uniqueUsers
      : [...url.uniqueUsers, ipAddress];

    const redirectCount = url.redirect + 1;

    return this.prisma.url.update({
      where: { id },
      data: { uniqueUsers: updatedUniqueUsers, redirect: redirectCount },
    });
  }

  async delete(id: string) {
    return await this.prisma.url.delete({
      where: {
        id: id,
      },
    });
  }

  async getQr(id: string) {
    const data = await this.getOne(id);
    if (!data) {
      return null;
    }
    const url = data.shortLink;
    const qr = qrImage.imageSync(url, { type: 'png' });

    const fileName = `qr_${id}.png`;

    const imagePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'images',
      fileName,
    );

    await fs.writeFile(imagePath, qr);

    await this.prisma.url.update({
      where: { id: id },
      data: {
        qrCode: `${fileName}`,
      },
    });
    return imagePath;
  }
}
