import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  timestamp: string;
  path: string;
}

/**
 * Transform all successful responses to a standard format
 * Excludes file downloads and streaming responses
 */
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  unknown
> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Skip transformation for streaming/file responses
    if (response.getHeader('Content-Type')?.toString().includes('stream')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If data already has a status field, it's a custom response shape
        // Extract message/data cleanly to avoid double-nesting
        if (data && typeof data === 'object' && 'status' in data) {
          const {
            status,
            message,
            data: innerData,
            ...rest
          } = data as {
            status: boolean;
            message?: string;
            data?: unknown;
            [key: string]: unknown;
          };
          return {
            success: status === true,
            statusCode: response.statusCode,
            message: message || 'Success',
            data: innerData !== undefined ? innerData : rest,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        // Standard transformation for all other responses
        return {
          success: true,
          statusCode: response.statusCode,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
