import { POST as stripeWebhookHandler } from './stripe/route';

export async function POST(request: any) {
  return stripeWebhookHandler(request);
}
