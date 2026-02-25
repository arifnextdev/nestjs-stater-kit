import { Module } from '@nestjs/common';
import { SeoService } from './services/seo.service';
import { DashboardService } from './services/dashboard.service';
import { SitemapService } from './services/sitemap.service';
import { SettingsService } from './services/settings.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from 'src/upload/upload.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CmsPublicController } from './public.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    UploadModule,
    CacheModule.register({ ttl: 60 }),
  ],
  controllers: [CmsPublicController],
  providers: [SeoService, DashboardService, SitemapService, SettingsService],
  exports: [SeoService, DashboardService, SitemapService, SettingsService],
})
export class CmsModule {}
