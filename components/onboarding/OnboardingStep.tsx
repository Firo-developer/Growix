'use client';

import {Input} from '@/components/ui/Input';
import {ArrowRight, UserRound} from 'lucide-react';
import {motion} from 'motion/react';
import {useState} from 'react';

interface OnboardingStepProps {
  onComplete: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function OnboardingStep({onComplete}: OnboardingStepProps) {
  const [name, setName] = useState('');

  return (
    <div className="px-7 pt-7 pb-7 sm:px-8 sm:pt-8 sm:pb-8">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        transition={{delay: 0.08, duration: 0.4, ease: EASE}}
        className="login-icon-circle mb-5">
        <UserRound className="h-4 w-4 text-heading" strokeWidth={2} />
      </motion.div>

      <motion.h1
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.12, duration: 0.45, ease: EASE}}
        className="text-[22px] font-semibold tracking-[-0.02em] text-heading sm:text-[24px]">
        What&apos;s your name?
      </motion.h1>
      <motion.p
        initial={{opacity: 0, y: 8}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.16, duration: 0.45, ease: EASE}}
        className="mt-1.5 text-[14px] leading-relaxed text-muted">
        This helps personalize your experience.
      </motion.p>

      <motion.form
        initial={{opacity: 0, y: 14}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.22, duration: 0.45, ease: EASE}}
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onComplete();
        }}>
        <label htmlFor="onboarding-name" className="mb-2 block text-[13px] font-medium text-heading">
          Full Name
        </label>

        <Input
          id="onboarding-name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="login-input h-11 text-[14px]"
          autoComplete="name"
          autoFocus
        />

        <motion.button
          type="submit"
          disabled={!name.trim()}
          whileHover={{y: name.trim() ? -1 : 0}}
          whileTap={{scale: name.trim() ? 0.985 : 1}}
          className="login-btn-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-45">
          Continue
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </motion.button>
      </motion.form>
    </div>
  );
}
