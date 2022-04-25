import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('Authorization');
    console.log('API-GUARD: is public', isPublic);
    console.log('API-GUARD: get Authorization', authHeader);
    console.log(
      'API-GUARD: can visit',
      isPublic || authHeader === this.configService.get('API_KEY'),
    );

    return isPublic || authHeader === this.configService.get('API_KEY');
  }
}
