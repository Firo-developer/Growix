'use client';

import {useState} from 'react';
import {Shield} from 'lucide-react';
import {Icon} from '@/components/ui/Icon';
import {Button} from '@/components/ui/Button';
import {Card} from '@/components/ui/Card';
import {Modal} from '@/components/ui/Modal';
import {useNotification} from '@/components/ui/Notification';

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

const securityItems = [
  {
    icon: 'lock' as const,
    title: 'Account Password',
    description: 'You have not set up a password for your account.',
    action: 'Set Password',
  },
  {
    icon: 'layer' as const,
    title: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your account.',
    action: 'Enable 2FA',
  },
  {
    icon: 'user' as const,
    title: 'Passkeys',
    description: 'Passkeys are a secure and convenient way to sign in.',
    action: 'Add Passkey',
  },
];

const thirdPartyAccounts = [
  {name: 'Google', logo: 'G', color: 'text-blue-500'},
  {name: 'Apple', logo: <AppleLogo />, color: 'text-heading'},
  {name: 'Zoom', logo: 'Z', color: 'text-blue-600'},
];

export function AccountTab() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {notify} = useNotification();

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold text-heading mb-4">Password & Security</h2>
        <Card padding="none" className="divide-y divide-border/60">
          {securityItems.map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-5">
              <Icon name={item.icon} size={22} className="opacity-50 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">{item.title}</p>
                <p className="text-xs text-muted mt-0.5">{item.description}</p>
              </div>
              <Button
                variant="dark"
                size="sm"
                className="shrink-0 hidden sm:inline-flex"
                onClick={() => {
                  if (item.title === 'Account Password') setConfirmOpen(true);
                }}>
                {item.action}
              </Button>
            </div>
          ))}
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-heading mb-2">Third Party Accounts</h2>
        <p className="text-sm text-text mb-5">
          Link your accounts to sign in to Luma and automate your workflows.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {thirdPartyAccounts.map((account) => (
            <Card key={account.name} padding="md" className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg bg-gray flex items-center justify-center text-sm font-bold ${account.color}`}>
                {account.logo}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">{account.name}</p>
                <p className="text-xs text-muted">Not Linked</p>
              </div>
              <Button variant="dark" size="sm" className="w-8 h-8 p-0 rounded-lg shrink-0">
                <Icon name="add" size={14} className="brightness-0 invert" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Access"
        description="To continue, please confirm your identity by authenticating with your existing credentials."
        icon={<Shield size={18} strokeWidth={1.75} className="text-heading" />}
        primaryLabel="Confirm Access"
        onPrimary={() => {
          setConfirmOpen(false);
          notify("That's not the correct code. Try again?", 'error');
        }}
      />
    </div>
  );
}
