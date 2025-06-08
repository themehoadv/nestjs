import { API_RESPONSE_METADATA } from '@/constants/auth.constant';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get metadata from decorators
    const responseMessage = this.reflector.get<string>(
      API_RESPONSE_METADATA.MESSAGE,
      context.getHandler(),
    );

    const statusCode =
      this.reflector.get<number>(
        API_RESPONSE_METADATA.CODE,
        context.getHandler(),
      ) || context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        status: true,
        code: statusCode,
        message: responseMessage || this.getDefaultMessage(statusCode),
        result: data,
      })),
    );
  }

  private getDefaultMessage(statusCode: number): string {
    const messages = {
      [HttpStatus.OK]: 'Request successful',
      [HttpStatus.CREATED]: 'Resource created successfully',
      [HttpStatus.ACCEPTED]: 'Request accepted',
      [HttpStatus.NO_CONTENT]: 'Resource deleted successfully',
      // Add more status codes as needed
    };
    return messages[statusCode] || 'Operation successful';
  }
}
