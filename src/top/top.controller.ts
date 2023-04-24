import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TopService } from './top.service';

@Controller('top')
export class TopController {
  constructor(public topService: TopService) {}

  @Get('/gainers')
  topGainers(@Query('startDate') start: number, @Query('endDate') end: number) {
    console.log(start);
    console.log(end);

    const startDate = new Date(start);
    const endDate = new Date(end);
    console.log(startDate.toString());
    console.log(endDate);
    const resp = this.topService.getTopGainers(startDate, endDate);
    return [{ name: 'BTCHTB', time: 165487554545 }];
  }
}
