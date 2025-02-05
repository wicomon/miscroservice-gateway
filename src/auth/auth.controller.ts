import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('auth.register.user', registerUserDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('auth.login.user', loginUserDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards( AuthGuard )
  @Get('verify')
  async verifyUser(
    @User() user: CurrentUser,
    @Token() token: string,
  ) {
    return {user, token}
    // try {
    //   const order = await firstValueFrom(
    //     this.client.send('auth.verify.user', token),
    //   );
    //   return order;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }
}
