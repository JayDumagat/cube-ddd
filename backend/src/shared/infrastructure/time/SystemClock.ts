import type { Clock } from "../../application/time/Clock";

export class SystemClock implements Clock {
  public now(): Date {
    return new Date();
  }
}

export const systemClock = new SystemClock();