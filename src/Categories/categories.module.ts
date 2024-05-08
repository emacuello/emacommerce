import { Module, OnModuleInit } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/categories.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule implements OnModuleInit {
    constructor(private categoriesService: CategoriesService) {}
    async onModuleInit() {
        await this.categoriesService.addCategories();
    }
}
