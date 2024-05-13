import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    NotFoundException,
    Param,
    ParseFilePipe,
    ParseUUIDPipe,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class CloudinaryController {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private readonly cloudsService: CloudinaryService,
    ) {}

    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Post('uploadImages/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImages(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 200000 }),
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|gif|svg|webp)$/,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const upload = await this.cloudsService.uploadImage(file);
        if (!upload) throw new BadRequestException('Error al subir la imagen');
        const product = await this.productRepository.findOneBy({ id });
        if (!product)
            throw new NotFoundException(
                `El producto con el id ${id} no existe`,
            );
        const updateProduct = await this.productRepository.update(
            { id },
            { imgUrl: upload.secure_url },
        );
        if (updateProduct.affected === 0)
            throw new BadRequestException('Error al subir la imagen');
        return {
            message: 'Imagen de producto actualizada con exito',
            updateProduct,
            upload,
        };
    }
}
