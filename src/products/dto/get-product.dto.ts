import { IntersectionType } from "@nestjs/mapped-types";
import { IsDate, IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query-dto";

class GetProductBaseDto{
    @IsDate()
    @IsOptional()
    startDate?: Date;
  
    @IsDate()
    @IsOptional()
    endDate?: Date;
}

export class GetProductDto extends IntersectionType(
    GetProductBaseDto,
    PaginationQueryDto,
  ) {}