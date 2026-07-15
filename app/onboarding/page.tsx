import {AuthExperience} from '@/components/auth/AuthExperience';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Onboarding — Growix',
  description: 'Complete your Growix profile setup.',
};

export default function Onboarding() {
  return <AuthExperience initialStep="onboarding" />;
}
