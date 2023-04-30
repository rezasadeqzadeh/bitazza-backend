import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { TopTypesEnum } from '../top.types.enum';

export interface Instrument {
  InstrumentId: string;
  Symbol: string;
}
export interface DiffPrice {
  diffPrice: number;
  startPrice: number;
  endPrice: number;
}
export interface InstrumentsHistory {
  startDate: Date;
  endDate: Date;
  instrumentsHistory: InstrumentHistory[];
}
export interface InstrumentHistory {
  instrument: Instrument;
  history: HistoryItem[];
  diffPrice: number;
}
export interface HistoryItem {
  close: number;
  time: number;
}

export class TopRequestDTO {
  @ApiProperty({ enum: TopTypesEnum })
  @IsNotEmpty()
  type: TopTypesEnum;

  @IsNumberString()
  @ApiProperty({ default: 1684783800000 })
  startDate: number;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ default: 1685388600000 })
  endDate: number;
}
