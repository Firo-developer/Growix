import {AuthExperience} from '@/components/auth/AuthExperience';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Sign In — Growix',
  description: 'Sign in or sign up to Growix.',
};

export default function Login() {
  return <AuthExperience initialStep="login" />;
}
