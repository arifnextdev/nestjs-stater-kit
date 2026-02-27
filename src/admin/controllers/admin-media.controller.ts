import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminMediaService, MediaQueryParams } from '../services/admin-media.service';
import { AuthenticateRequest } from 'src/auth/types/types';

@ApiTags('Admin - Media')
@ApiBearerAuth('JWT-auth')
@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminMediaController {
  constructor(private readonly adminMediaService: AdminMediaService) {}

  @Get()
  @ApiOperation({ summary: 'List all media files with pagination and filters' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media files retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'mimeType', required: false, enum: ['all', 'image', 'video', 'document'] })
  @ApiQuery({ name: 'folder', required: false, type: String })
  async getAll(@Query() query: MediaQueryParams) {
    return this.adminMediaService.getAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get media library statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stats retrieved successfully' })
  async getStats() {
    return this.adminMediaService.getStats();
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a media file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'File uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|gif|svg|pdf|doc|docx|txt|mp4|webm)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() req: AuthenticateRequest,
  ) {
    const uploadedBy = (req.user as any)?.id ?? undefined;
    return this.adminMediaService.upload(file, 'media', uploadedBy);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a media file by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Media not found' })
  @ApiParam({ name: 'id', type: String })
  async deleteById(@Param('id') id: string) {
    return this.adminMediaService.deleteById(id);
  }
}
