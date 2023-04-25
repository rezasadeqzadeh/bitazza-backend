export class InstrumentsEmpty extends Error {
  constructor() {
    super('Instruments list is not populated yet. please try few seconds');
  }
}
