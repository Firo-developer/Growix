import {AuthExperience} from '@/components/auth/AuthExperience';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Onboarding — EthioGrowth AI',
  description: 'Complete your EthioGrowth AI profile setup.',
};

export default function Onboarding() {
  return <AuthExperience initialStep="onboarding" />;
}
