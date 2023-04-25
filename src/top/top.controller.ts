import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TopService } from './top.service';

@Controller('top')
export class TopController {
  constructor(public topService: TopService) {}

  @Get('/gainers')
  async topGainers(
    @Query('startDate') start: number,
    @Query('endDate') end: number,
  ) {
    const startDate = new Date(Number(start));
    const endDate = new Date(Number(end));
    const resp = await this.topService.getTopGainers(startDate, endDate);
    return [{ name: 'BTCHTB', time: 165487554545 }];
  }
}
