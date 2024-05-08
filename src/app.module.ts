import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { ProductsModule } from './Products/products.module';
import { AuthModule } from './Auth/auth.module';
import { ConfigModuleRoot } from './config/config.module';
import { ConfigTypOrmModule } from './config/configTypOrm.module';
import { CategoriesModule } from './Categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import * as morgan from 'morgan';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { JwtConfigModule } from './config/jtw.module';

@Module({
    imports: [
        ConfigModuleRoot,
        ConfigTypOrmModule,
        CategoriesModule,
        OrdersModule,
        UsersModule,
        ProductsModule,
        AuthModule,
        CloudinaryModule,
        JwtConfigModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(morgan('dev')).forRoutes('*');
    }
}
