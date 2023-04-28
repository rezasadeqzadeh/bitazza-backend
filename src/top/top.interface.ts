import { InstrumentHistory } from './dto';
import { TopTypesEnum } from './top.types.enum';

export interface TopServiceInt {
  topInstruments(
    topType: TopTypesEnum,
    startDate: Date,
    endDate: Date,
  ): Promise<InstrumentHistory[]>;
}
