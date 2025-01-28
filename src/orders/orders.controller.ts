import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateStatusDto } from './dto/update-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { StatusDto } from './dto/status.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(
    @Query() orderPaginationDto: OrderPaginationDto,
  ) {
    return this.client.send('findAllOrders', orderPaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', {id})
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
    // .pipe(
      // catchError((error) => {
      //   throw new RpcException(error);
      // }),
    // );
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    // return {status, PaginationDto};
    try {
      const order = await firstValueFrom(
        this.client.send('findAllOrders', {
          ...paginationDto, 
          status: statusDto.status
        })
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateStatusDto: UpdateStatusDto
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send('changeOrderStatus', {
          id, 
          status: updateStatusDto.status
        })
      );
      // console.log(order)
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.ordersService.remove(+id);
  }
}
