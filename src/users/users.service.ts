import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { LoginDTO } from './dto/login_dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const newuser = await this.prisma.user.create({ data: createUserDto });

    if (!newuser) {
      throw new HttpException(
        'Something went wrong during creating user',
        HttpStatus.NOT_FOUND,
      );
    }

    delete createUserDto.password;
    return newuser;
  }

  public async findByEmail(loginDto: LoginDTO): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
