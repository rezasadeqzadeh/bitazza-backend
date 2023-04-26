import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TopService, TopType } from './top.service';

@Controller('top')
export class TopController {
  constructor(public topService: TopService) {}

  @Get('/gainers')
  async topGainers(
    @Query('type') type: TopType = 'gainers',
    @Query('startDate') start: number,
    @Query('endDate') end: number,
  ) {
    const startDate = new Date(Number(start));
    const endDate = new Date(Number(end));
    return await this.topService.getTopGainers(type, startDate, endDate);
  }
}
