import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryConfig } from '../config/cloudinary.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [CloudinaryController],
    providers: [CloudinaryService, cloudinaryConfig],
})
export class CloudinaryModule {}
