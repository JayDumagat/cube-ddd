import { randomUUID } from "node:crypto";

import type { IdGenerator } from "../../domain/services/IdGenerator";

export class UuidGenerator implements IdGenerator {
  public generate(): string {
    return randomUUID();
  }
}

export const uuidGenerator = new UuidGenerator();