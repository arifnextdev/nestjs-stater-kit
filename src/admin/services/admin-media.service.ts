import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

export interface MediaQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  mimeType?: string;
  folder?: string;
}

@Injectable()
export class AdminMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async getAll(params: MediaQueryParams) {
    const pageNum = parseInt(params.page ?? '1', 10) || 1;
    const limitNum = parseInt(params.limit ?? '24', 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (params.search) {
      where.filename = { contains: params.search, mode: 'insensitive' };
    }

    if (params.mimeType && params.mimeType !== 'all') {
      if (params.mimeType === 'image') {
        where.mimeType = { startsWith: 'image/' };
      } else if (params.mimeType === 'video') {
        where.mimeType = { startsWith: 'video/' };
      } else if (params.mimeType === 'document') {
        where.mimeType = {
          in: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
          ],
        };
      } else {
        where.mimeType = { contains: params.mimeType };
      }
    }

    if (params.folder) {
      where.folder = params.folder;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          uploader: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async upload(file: Express.Multer.File, folder: string, uploadedBy?: string) {
    const result = await this.uploadService.uploadFile(file, folder);

    const url =
      (result as any).Location ??
      `/api/v1/media?key=${encodeURIComponent(result.Key)}`;

    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        url,
        key: result.Key,
        mimeType: file.mimetype,
        size: file.size,
        folder,
        uploadedBy: uploadedBy ?? null,
      },
    });

    return media;
  }

  async deleteById(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media with id ${id} not found`);
    }

    await this.uploadService.deleteFile(media.key);
    await this.prisma.media.delete({ where: { id } });

    return { message: 'Media deleted successfully' };
  }

  async getStats() {
    const [total, aggregate] = await this.prisma.$transaction([
      this.prisma.media.count(),
      this.prisma.media.aggregate({ _sum: { size: true } }),
    ]);

    const totalSize = aggregate._sum.size ?? 0;

    const byType = await this.prisma.media.groupBy({
      by: ['mimeType'],
      _count: { mimeType: true },
    });

    return { total, totalSize, byType };
  }
}
