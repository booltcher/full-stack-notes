import { CoffeesService } from './coffees.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { Public } from '../common/decorators/public.decorator';
import { IntParserPipe } from '../common/pipes/int-parser.pipe';
import { Protocol } from '../common/decorators/protocol.decorator';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('coffees')
@Controller('coffees')
@UseFilters(HttpExceptionFilter)
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    // console.log('request', request);
  }

  @ApiForbiddenResponse({
    description: 'Successful operation123',
  })
  @ApiOperation({
    summary: '获取全部',
    description: '获取全部的coffee列表',
    // externalDocs: ExternalDocumentationObject;
    operationId: '1',
  })
  @Get()
  @Public()
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    console.log(protocol);

    // throw new ForbiddenException();
    return this.coffeesService.findAll(paginationQueryDto);
  }

  // 接收指定参数
  @Get(':id')
  async findOne(
    @Param('id', IntParserPipe)
    id: string,
  ) {
    console.log('id', id);

    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.findOne(id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.delete(id);
  }
}
