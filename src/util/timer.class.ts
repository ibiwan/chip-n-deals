export class Timer {
  static start() {
    return new Timer();
  }
  private constructor() {
    this.startTime = process.hrtime();
  }
  finish() {
    const endTime = process.hrtime();
    const elapsedTime = endTime.map((time, i) => time - this.startTime[i]);
    return new TimerResult(elapsedTime);
  }
  private startTime: number[];
}

class TimerResult {
  constructor(elapsedTime: number[]) {
    this.elapsedTime = elapsedTime;
  }
  elapsedTime: number[];
  s() {
    return this.elapsedTime[0];
  }
  ns() {
    return this.elapsedTime[1];
  }
  ms() {
    return this.elapsedTime[0] * 1000 + this.elapsedTime[1] / 1000000;
  }
}
