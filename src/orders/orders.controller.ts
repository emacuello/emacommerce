import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDtos } from '../dtos/order.dtos';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard)
    async addOrder(@Body() productCart: OrderDtos) {
        return await this.ordersService.addOrder(productCart);
    }

    @ApiBearerAuth()
    @Get()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllOrder() {
        return await this.ordersService.getAllOrder();
    }

    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard)
    async getOrders(@Param('id', ParseUUIDPipe) id: string) {
        return await this.ordersService.getOrders(id);
    }
}
