import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({ data: createTaskDto });
    if (!task) {
      throw new HttpException(
        'Something went wrong during creating task',
        HttpStatus.NOT_FOUND,
      );
    }
    return task;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({});
    if (!tasks) {
      throw new HttpException('Something went wrong', HttpStatus.NOT_FOUND);
    }
    return tasks;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updateTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    if (!updateTask) {
      throw new HttpException('Task Failed to update', HttpStatus.BAD_GATEWAY);
    }

    return updateTask;
  }

  async remove(id: number) {
    await this.prisma.task.delete({
      where: { id },
    });
  }
}
