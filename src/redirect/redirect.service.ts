import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlsService } from 'src/urls/urls.service';

@Injectable()
export class RedirectService {
  constructor(private urlService: UrlsService) {}
  async redirect(shortLink: string, ipAddress: string) {
    const { id, originalLink } = await this.urlService.getLink(shortLink);
    if (!originalLink) {
      throw new NotFoundException('Ссылка не найдена');
    }
    await this.urlService.updateStatistics(id, ipAddress);
    return originalLink;
  }
}
