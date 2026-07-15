'use client';

import {Card} from '@/components/ui/Card';

export function PaymentTab() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-heading mb-2">Payment Methods</h2>
        <p className="text-sm text-text mb-5">
          Manage your payment methods for event tickets and subscriptions.
        </p>
        <Card padding="lg" className="text-center py-12">
          <p className="text-sm font-semibold text-heading mb-1">No Payment Methods</p>
          <p className="text-xs text-muted">You have not added any payment methods yet.</p>
        </Card>
      </section>
    </div>
  );
}
