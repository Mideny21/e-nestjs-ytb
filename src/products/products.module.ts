import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MediaModule } from '../media/media.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [MediaModule, PrismaModule, PaginationModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
