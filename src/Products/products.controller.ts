import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../guards/auth.guard';
import { ProductsDtos, PutProductDto } from '../dtos/product.dtos';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly pruductsService: ProductsService) {}

    @Get()
    async findProducts(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        if (!page || !limit) {
            return await this.pruductsService.findProducts(1, 5);
        }
        return await this.pruductsService.findProducts(
            Number(page),
            Number(limit),
        );
    }

    @Get('seeders')
    async createProduct() {
        return await this.pruductsService.createProduct();
    }

    @ApiBearerAuth()
    @Get('deleteall')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteAllProducts() {
        return await this.pruductsService.deleteAllProducts();
    }

    @Get(':id')
    async getOneProduct(@Param('id', ParseUUIDPipe) id: string) {
        return await this.pruductsService.getOneProduct(id);
    }

    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async postProduct(@Body() product: ProductsDtos) {
        return await this.pruductsService.postProduct(product);
    }

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    async updateProduct(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() product: PutProductDto,
    ) {
        return await this.pruductsService.updateProduct(id, product);
    }

    @ApiBearerAuth()
    @Delete(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return await this.pruductsService.deleteProduct(id);
    }
}
