import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}


export class UpdateStatusDto {

  @IsEnum(OrderStatusList, {
    message: `Possible status values are ${OrderStatusList}`,
  })
  status: OrderStatus;
}