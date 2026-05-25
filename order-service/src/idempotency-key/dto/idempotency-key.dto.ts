export class IdempotencyKeyDto {
  id?: string;
  idempotencyKey!: string;
  requestHash!: string;
  response!: Record<string, any>;
}
