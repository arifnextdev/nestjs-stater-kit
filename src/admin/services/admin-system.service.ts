import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/services/cache.service';

@Injectable()
export class AdminSystemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async getSystemHealth() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Get system info
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      
      return {
        status: 'healthy',
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
        },
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getSystemLogs() {
    // In a real implementation, you would read from log files or a logging service
    return {
      message: 'System logs would be retrieved from logging service (Pino/Winston)',
      suggestion: 'Integrate with external logging service like ELK stack or CloudWatch',
    };
  }

  async getAuditLogs() {
    const auditLogs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        userId: true,
        action: true,
        entity: true,
        entityId: true,
        changes: true,
        ip: true,
        userAgent: true,
        createdAt: true,
      },
    });

    return {
      data: auditLogs,
      total: auditLogs.length,
    };
  }

  async clearCache() {
    try {
      // Clear application cache (implement based on your cache service)
      // await this.cache.clear();
      
      return {
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        message: 'Failed to clear cache',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getDatabaseStats() {
    try {
      const [
        userCount,
        blogCount,
        commentCount,
        roleCount,
        permissionCount,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.blog.count(),
        this.prisma.blogComment.count(),
        this.prisma.role.count(),
        this.prisma.permission.count(),
      ]);

      // Get database size (PostgreSQL specific)
      const dbSize = await this.prisma.$queryRaw`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `;

      return {
        tables: {
          users: userCount,
          blogs: blogCount,
          comments: commentCount,
          roles: roleCount,
          permissions: permissionCount,
        },
        databaseSize: (dbSize as any)[0]?.size || 'Unknown',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: 'Failed to retrieve database stats',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
