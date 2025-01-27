import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app_config';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    MediaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
