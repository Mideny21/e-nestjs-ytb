import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly prisma: PrismaService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const uploadedImages = await Promise.all(
      files.map((file) => this.mediaService.uploadImages(file)),
    );

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        stock: createProductDto.stock,
        categoryId: parseInt(String(createProductDto.categoryId)),
        ProductImage: {
          create: uploadedImages.map((url) => ({
            url,
          })),
        },
      },
      include: {
        ProductImage: true,
      },
    });

    return product;
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: { ProductImage: { select: { url: true } } },
    });
    if (!products) {
      throw new HttpException('No available product', HttpStatus.NOT_FOUND);
    }
    return products;
  }
  public async findAllByCategory(categoryId: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: { ProductImage: { select: { url: true } } },
    });
    if (!products) {
      throw new HttpException('No Product Not Found!', HttpStatus.NOT_FOUND);
    }
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { ProductImage: { select: { url: true } } },
    });

    if (!product) {
      throw new HttpException('Product Not Found!', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
