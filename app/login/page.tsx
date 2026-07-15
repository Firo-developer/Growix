import {AuthExperience} from '@/components/auth/AuthExperience';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Sign In — EthioGrowth AI',
  description: 'Sign in or sign up to EthioGrowth AI.',
};

export default function Login() {
  return <AuthExperience initialStep="login" />;
}
