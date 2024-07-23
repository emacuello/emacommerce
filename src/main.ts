import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './middleware/middleware';
import {
    BadRequestException,
    NotFoundException,
    ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Ecommerce-emacuello API')
        .setDescription('Ecommerce para el Modulo 4 de Henry')
        .addBearerAuth()
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
        ],
        customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
        ],
    });
    app.use(Logger);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    await app.listen(PORT);
}
bootstrap();
