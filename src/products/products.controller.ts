import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from './utils/file-validator';
import { GetProductDto } from './dto/get-product.dto';
import { filter } from 'rxjs';
import { FilterProductDto, GetFilteredProductDto } from './dto/fiilter_product_dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]) as any,
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(new FileTypeValidationPipe())
    files: { images?: Express.Multer.File[] },
  ) {
    return this.productsService.create(createProductDto, files.images || []);
  }

  @Get()
  findAll(@Query() productQuery: GetProductDto) {
    console.log(productQuery)
    return this.productsService.findAll(productQuery);
  }


  @Get('search')
  search(@Query() filterDto: GetFilteredProductDto) {
    console.log(filterDto)

    return this.productsService.getFilteredProducts(filterDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('category/:id')
  findByCategory(@Param('id') id: string, @Query() productQuery: GetProductDto) {
    return this.productsService.findAllByCategory(+id, productQuery);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
