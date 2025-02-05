import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { NATS_SERVICE } from "src/config";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(NATS_SERVICE  ) private readonly client: ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if(!token) {
      throw new UnauthorizedException('Token Not Found');
    }

    try {

      const {user, token: newToken} = await firstValueFrom(
        this.client.send('auth.verify.user', token),
      );

      request['user'] = user;
      request['token'] = newToken;

    } catch (error) {
      throw new UnauthorizedException()
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if(!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    
    return type === 'Bearer' && token ? token : undefined;
  }
}