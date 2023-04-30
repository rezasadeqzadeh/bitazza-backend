import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TopService } from './top.service';
import { TopRequestDTO } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Top')
@Controller({
  path: 'top',
  version: '1',
})
export class TopController {
  constructor(public topService: TopService) {
    console.log('constructor top controller called.');
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async top(@Query() request: TopRequestDTO) {
    const startDate = new Date(Number(request.startDate));
    const endDate = new Date(Number(request.endDate));
    return this.topService.topInstruments(request.type, startDate, endDate);
  }
}
