import { InstrumentHistory } from './dto';
import { TopTypesEnum } from './top.types.enum';

export interface TopFeatures {
  topInstruments(
    topType: TopTypesEnum,
    startDate: Date,
    endDate: Date,
  ): Promise<InstrumentHistory[]>;
  diffPrice(insHistory: InstrumentHistory[]): InstrumentHistory[];
  topSlice(type: TopTypesEnum, list: InstrumentHistory[]): InstrumentHistory[];
}
