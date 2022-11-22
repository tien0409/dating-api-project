import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export type Response<T> = {
  statusCode: number;
  message: string;
  data: T;
};

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse()?.statusCode || 500,
        reqId: context.switchToHttp().getRequest()?.reqId,
        message: data?.message || '',
        data,
      })),
    );
  }
}
