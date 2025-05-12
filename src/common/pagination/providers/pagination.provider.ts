import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../dtos/pagination-query-dto';
import { Paginated } from '../interfaces/paginated.interfaces';


@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T>(
    paginationQuery: PaginationQueryDto,
    prismaDelegate: {
      findMany: (args: Prisma.Prisma__Pick<any, 'skip' | 'take' | 'where' | 'orderBy' | 'include'>) => Promise<T[]>;
      count: (args?: Prisma.Prisma__Pick<any, 'where'>) => Promise<number>;
    },
    options?: {
      where?: Prisma.Prisma__Pick<any, 'where'>['where'];
      orderBy?: Prisma.Prisma__Pick<any, 'orderBy'>['orderBy'];
      include?: Prisma.Prisma__Pick<any, 'include'>['include'];
    },
  ): Promise<Paginated<T>> {
    const { limit, page } = paginationQuery;
    const skip = (page - 1) * limit;

    const [results, totalItems] = await Promise.all([
      prismaDelegate.findMany({
        skip,
        take: limit,
        where: options?.where,
        orderBy: options?.orderBy,
        include: options?.include,
      }),
      prismaDelegate.count({
        where: options?.where,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const baseURL = `${this.request.protocol}://${this.request.headers.host}`;
    const newUrl = new URL(this.request.url, baseURL);

    const nextPage = page < totalPages ? page + 1 : page;
    const previousPage = page > 1 ? page - 1 : page;

    return {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${previousPage}`,
      },
    };
  }
}