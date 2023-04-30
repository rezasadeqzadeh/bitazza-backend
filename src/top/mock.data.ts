import { HistoryItem, Instrument, InstrumentHistory } from './dto';

export const REQUEST_START_DATE = 1682105400000;
export const REQUEST_END_DATE = 1682741204786;

export const BTCInst = {
  InstrumentId: '1',
  Symbol: 'BTCTHB',
} as Instrument;

export const QBTCInst = {
  InstrumentId: '12',
  Symbol: 'QBTCTHB',
} as Instrument;

const BTCPriceHistory: HistoryItem[] = [
  { close: 961145.19, time: 1682208000000 },
  { close: 944482.9, time: 1682294400000 },
];

const QBTCPriceHistory: HistoryItem[] = [
  { close: 222053.73, time: 1682208000000 },
  { close: 222003.73, time: 1682294400000 },
];

export const MOCK_INSTRUMENTS_HISTORY = [
  {
    instrument: BTCInst,
    history: BTCPriceHistory,
    diffPrice: 0,
  } as InstrumentHistory,
  {
    instrument: QBTCInst,
    history: QBTCPriceHistory,
    diffPrice: 0,
  } as InstrumentHistory,
];
