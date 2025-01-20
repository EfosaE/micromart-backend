export class PaymentInitiatedEvent {
  constructor(public readonly email: string, public readonly paymentId: string) {}
}
