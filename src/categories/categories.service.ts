import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  public async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });
    if (!category) {
      throw new HttpException(
        `Something went wrong during creating ${createCategoryDto.name}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  public async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({});

    if (!categories) {
      throw new HttpException('Something went wrong', HttpStatus.NOT_FOUND);
    }
    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
