import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDtos } from '../dtos/category.dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
    @Get()
    async getCategories() {
        return await this.categoriesService.getCategories();
    }
    @Get('seeder')
    addCategories() {
        return this.categoriesService.addCategories();
    }

    @ApiBearerAuth()
    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async postCategory(@Body() category: CategoriesDtos) {
        return await this.categoriesService.postCategory(category);
    }
}
