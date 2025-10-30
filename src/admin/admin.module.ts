import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { AdminController } from './admin.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminBlogsController } from './controllers/admin-blogs.controller';
import { AdminRolesController } from './controllers/admin-roles.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminSystemController } from './controllers/admin-system.controller';
import { AdminService } from './admin.service';
import { AdminUsersService } from './services/admin-users.service';
import { AdminBlogsService } from './services/admin-blogs.service';
import { AdminRolesService } from './services/admin-roles.service';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminSystemService } from './services/admin-system.service';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [
    AdminController,
    AdminUsersController,
    AdminBlogsController,
    AdminRolesController,
    AdminDashboardController,
    AdminSystemController,
  ],
  providers: [
    AdminService,
    AdminUsersService,
    AdminBlogsService,
    AdminRolesService,
    AdminDashboardService,
    AdminSystemService,
  ],
  exports: [
    AdminService,
    AdminUsersService,
    AdminBlogsService,
    AdminRolesService,
    AdminDashboardService,
    AdminSystemService,
  ],
})
export class AdminModule {}
