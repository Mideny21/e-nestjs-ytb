import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { GetProductDto } from './dto/get-product.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interfaces';
import { FilterProductDto, GetFilteredProductDto } from './dto/fiilter_product_dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly prisma: PrismaService,
    private readonly paginationProvider: PaginationProvider
  ) { }
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

  public async findAll(productsQuery: GetProductDto) {

    let products = await this.paginationProvider.paginateQuery(
      { limit: productsQuery.limit, page: productsQuery.page },
      this.prisma.product,
      {

        include: { ProductImage: { select: { url: true } } } // Include relations
      }
    );


    return products;
  }


  async getFilteredProducts(filterDto: GetFilteredProductDto) {
    const {
      keyword,
      categoryId,
      minPrice,
      maxPrice,
      sort,
      limit,
      page

    } = filterDto;

    const where: Prisma.ProductWhereInput = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, } },
        { description: { contains: keyword, } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      };
    }


    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    if (sort === 'priceLowToHigh') orderBy = { price: 'asc' };
    else if (sort === 'priceHighToLow') orderBy = { price: 'desc' };

    return this.paginationProvider.paginateQuery(
      { limit, page },
      this.prisma.product,
      {
        where,
        orderBy,
        include: {
          ProductImage: { select: { url: true } },
          category: true,
        },
      }
    );
  }

  public async findAllByCategory(categoryId: number, productsQuery: GetProductDto) {

    let productsByCategory = await this.paginationProvider.paginateQuery(
      { limit: productsQuery.limit, page: productsQuery.page },
      this.prisma.product,
      {
        where: { categoryId },
        include: { ProductImage: { select: { url: true } } } // Include relations
      }
    );

    return productsByCategory;


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
