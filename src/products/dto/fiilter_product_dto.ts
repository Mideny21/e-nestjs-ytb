import { IntersectionType } from "@nestjs/mapped-types";
import { IsInt, IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query-dto";

export class FilterProductDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @IsString()
    minPrice?: string;

    @IsOptional()
    @IsString()
    maxPrice?: string;

    @IsOptional()
    @IsString()
    sort?: 'latest' | 'priceLowToHigh' | 'priceHighToLow';

    @IsOptional()
    newArrival?: boolean;

    @IsOptional()
    fridayDeal?: boolean;
}

export class GetFilteredProductDto extends IntersectionType(FilterProductDto, PaginationQueryDto) { }
