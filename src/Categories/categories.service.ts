import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/categories.entity';
import { Repository } from 'typeorm';
import { products } from '../helpers/data.seed';
import { CategoriesDtos } from '../dtos/category.dtos';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    async getCategories() {
        const categories = await this.categoriesRepository.find();
        if (!categories.length)
            throw new NotFoundException(
                'No hay categorias cargadas en las base de datos',
            );
        return categories;
    }
    async addCategories() {
        return Promise.all(
            products.map(async (product) => {
                const { category, ...rest } = product;
                await this.categoriesRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Category)
                    .values({ name: category })
                    .orIgnore()
                    .execute();
            }),
        ).then(() => {
            return 'Categorías agregadas correctamente';
        });
    }

    async postCategory(category: CategoriesDtos) {
        const duplicate = await this.categoriesRepository.findOneBy({
            name: category.name,
        });
        if (!duplicate) {
            const categories = this.categoriesRepository.create(category);
            if (!categories.id)
                throw new BadRequestException('Error al crear la categoria');
            return await this.categoriesRepository.save(categories);
        } else throw new BadRequestException('La categoria ya existe');
    }
}
