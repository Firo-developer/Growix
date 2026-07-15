'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {AnimatePresence, motion} from 'motion/react';
import {useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes} from 'react';
import {ThemeToggle} from '@/components/layout/ThemeToggle';
import {Icon} from '@/components/ui/Icon';
import {TextEffect} from '@/components/motion-primitives/text-effect';

type AuthStep = 'login' | 'signup' | 'onboarding';

interface AuthExperienceProps {
  initialStep: AuthStep;
}

const copy: Record<AuthStep, {eyebrow: string; title: string; description: string}> = {
  login: {eyebrow: 'Welcome back', title: 'Pick up your growth plan.', description: 'Sign in to continue with your workspace.'},
  signup: {eyebrow: 'Create your workspace', title: 'Start with a clear next step.', description: 'Set up your Growix account in a minute.'},
  onboarding: {eyebrow: 'Business setup', title: 'Tell us about your business.', description: 'A few details now give your AI guidance the right local context.'},
};

const onboardingSteps = [
  {title: 'Business information', description: 'Start with the essentials about the business you lead.'},
  {title: 'Location', description: 'Tell us where your business serves customers.'},
  {title: 'Products and services', description: 'Help us understand what your business offers.'},
  {title: 'Target customers', description: 'Describe the people you want to reach.'},
  {title: 'Business goals', description: 'Choose the outcomes that matter most right now.'},
  {title: 'Current challenges', description: 'Select the obstacles slowing your growth.'},
  {title: 'Marketing', description: 'Share the channels and investment you use today.'},
  {title: 'Brand identity', description: 'Set the tone your brand should use everywhere.'},
  {title: 'AI preferences', description: 'Choose how Growix can be most helpful.'},
];

// `compact` is only used by the onboarding wizard — the login/signup card keeps its original size and
// translucent fill, since only the onboarding page asked to lose the "card" look and go smaller.
function Field({label, icon, compact = false, ...props}: InputHTMLAttributes<HTMLInputElement> & {label: string; icon: string; compact?: boolean}) {
  return (
    <label className="block">
      <span className={`mb-1.5 block font-medium text-heading ${compact ? 'text-xs' : 'text-[13px]'}`}>{label}</span>
      <span className={`flex items-center gap-2.5 rounded-xl border border-border/70 px-3 text-muted shadow-sm transition-colors focus-within:border-heading/25 focus-within:ring-2 focus-within:ring-heading/5 ${compact ? 'h-10 bg-transparent shadow-none' : 'h-11 bg-card/70 dark:bg-card/80'}`}>
        <Icon name={icon} size={compact ? 14 : 16} />
        <input {...props} className="min-w-0 flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-muted" />
      </span>
    </label>
  );
}

function TextField({label, placeholder}: {label: string; placeholder: string}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-heading">{label}</span>
      <textarea rows={3} placeholder={placeholder} className="w-full resize-none rounded-xl border border-border/70 bg-transparent px-3 py-2 text-sm leading-5 text-heading outline-none placeholder:text-muted focus:border-heading/25 focus:ring-2 focus:ring-heading/5" />
    </label>
  );
}

// Multi-select chip group — for questions where more than one answer is valid.
function ChoiceGroup({label, options, value, onChange, optional = false}: {label: string; options: string[]; value: string[]; onChange: (value: string[]) => void; optional?: boolean}) {
  const choose = (option: string) => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);

  return (
    <fieldset>
      <legend className="mb-1.5 flex items-center gap-2 text-xs font-medium text-heading">
        {label}
        {optional && <span className="font-normal text-muted">Optional</span>}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => choose(option)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] transition-colors ${selected ? 'public-accent-bg border-[#28745d] font-medium dark:border-[#6db89a]' : 'border-border/70 bg-transparent text-text hover:border-border'}`}>
              {selected && <Icon name="copy-success" size={13} />}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ChevronIcon({open}: {open: boolean}) {
  return (
    <motion.svg
      animate={{rotate: open ? 180 : 0}}
      transition={{duration: 0.18, ease: 'easeOut'}}
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-muted">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

// Single-select dropdown — for questions with exactly one right answer.
// The trigger is transparent (no card fill), so it sits directly on the page; the open panel stays a
// solid surface since it floats over whatever content is beneath it.
function Select({label, options, value, onChange, optional = false, placeholder = 'Select an option'}: {label: string; options: string[]; value: string[]; onChange: (value: string[]) => void; optional?: boolean; placeholder?: string}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = value[0];

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-heading">
        {label}
        {optional && <span className="font-normal text-muted">Optional</span>}
      </span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2.5 rounded-xl border bg-transparent px-3 text-left text-sm transition-colors ${open ? 'border-heading/25 ring-2 ring-heading/5' : 'border-border/70 hover:border-border'}`}>
        <span className={`min-w-0 flex-1 truncate ${selected ? 'text-heading' : 'text-muted'}`}>{selected ?? placeholder}</span>
        <ChevronIcon open={open} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity: 0, y: -6, scale: 0.98}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: -6, scale: 0.98}}
            transition={{duration: 0.15, ease: 'easeOut'}}
            role="listbox"
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border/70 bg-card p-1 shadow-lg">
            <div className="max-h-56 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selected === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(isSelected ? [] : [option]);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-gray/60 ${isSelected ? 'public-accent font-medium' : 'text-text'}`}>
                    {option}
                    {isSelected && <Icon name="copy-success" size={13} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [choices, setChoices] = useState<Record<string, string[]>>({
    businessType: [], age: [], gender: [], income: [], goals: [], challenges: [], budget: [], channels: [], personality: [], tone: [], language: [], aiHelp: [], reportLanguage: [],
  });

  const setChoice = (key: string) => (value: string[]) => setChoices((current) => ({...current, [key]: value}));
  const finish = () => {
    setIsCompleting(true);
    window.setTimeout(() => router.push('/dashboard'), 1700);
  };

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field compact label="Business name" icon="ai-homepage" placeholder="Selam Coffee House" required />
            <Field compact label="Owner name" icon="user" placeholder="Your full name" required />
            <Select label="Business type" placeholder="Select business type" options={['Sole owner', 'Partnership', 'Company', 'Cooperative']} value={choices.businessType} onChange={setChoice('businessType')} />
            <Field compact label="Industry" icon="profile" placeholder="Food and beverage" />
            <Field compact label="Years in business" icon="calendar" type="number" min="0" placeholder="3" />
            <Field compact label="Number of employees" icon="user" type="number" min="0" placeholder="6" />
          </div>
        );
      case 1:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            <Field compact label="Country" icon="location" placeholder="Ethiopia" required />
            <Field compact label="Region" icon="location" placeholder="Addis Ababa" required />
            <Field compact label="City" icon="location" placeholder="Bole" required />
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field compact label="Main products" icon="archive-add" placeholder="Coffee beans, pastries" />
              <Field compact label="Main services" icon="profile" placeholder="Catering, delivery" />
            </div>
            <TextField label="Short business description" placeholder="What makes your business useful and distinct?" />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <TextField label="Who are your customers?" placeholder="For example: young professionals and university students" />
            <ChoiceGroup label="Customer age group" options={['18-24', '25-34', '35-44', '45+']} value={choices.age} onChange={setChoice('age')} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Customer gender" placeholder="Select gender" options={['Women', 'Men', 'All genders']} value={choices.gender} onChange={setChoice('gender')} optional />
              <Field compact label="Customer location" icon="location" placeholder="Addis Ababa and online" />
            </div>
            <Select label="Income level" placeholder="Select income level" options={['Budget-conscious', 'Mid-market', 'Premium']} value={choices.income} onChange={setChoice('income')} optional />
          </div>
        );
      case 4:
        return <ChoiceGroup label="What do you want to achieve?" options={['Increase sales', 'Get more customers', 'Improve branding', 'Expand online', 'Launch new product', 'Open new branch', 'Other']} value={choices.goals} onChange={setChoice('goals')} />;
      case 5:
        return <ChoiceGroup label="What is challenging right now?" options={['Low sales', 'Low brand awareness', 'Few customers', 'Weak social media presence', 'High competition', 'Other']} value={choices.challenges} onChange={setChoice('challenges')} />;
      case 6:
        return (
          <div className="space-y-4">
            <Select label="Monthly marketing budget" placeholder="Select budget range" options={['Under 1,000 ETB', '1,000-5,000 ETB', '5,000-15,000 ETB', '15,000+ ETB']} value={choices.budget} onChange={setChoice('budget')} />
            <ChoiceGroup label="Current marketing channels" options={['Facebook', 'Instagram', 'TikTok', 'Telegram', 'Website', 'Other']} value={choices.channels} onChange={setChoice('channels')} />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Select label="Brand personality" placeholder="Select personality" options={['Warm and friendly', 'Bold and energetic', 'Professional', 'Premium and refined']} value={choices.personality} onChange={setChoice('personality')} />
              <Select label="Preferred tone of voice" placeholder="Select tone" options={['Conversational', 'Confident', 'Helpful', 'Playful']} value={choices.tone} onChange={setChoice('tone')} />
              <Select label="Preferred language" placeholder="Select language" options={['Amharic', 'English', 'Both']} value={choices.language} onChange={setChoice('language')} />
            </div>
            <label className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-dashed border-border/70 bg-transparent px-3.5 py-3 text-[13px] text-text transition-colors hover:border-border sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="block font-medium text-heading">Business logo</span>
                <span className="text-xs text-muted">Optional, PNG or JPG</span>
              </span>
              <span className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-border/70 bg-transparent px-2.5 text-[13px] font-medium text-heading">
                <Icon name="gallery-add" size={14} />
                Upload
              </span>
              <input type="file" accept="image/png,image/jpeg" className="sr-only" />
            </label>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <ChoiceGroup label="What should the AI help with most?" options={['Marketing ideas', 'Sales growth', 'Content creation', 'Customer insights', 'Business strategy']} value={choices.aiHelp} onChange={setChoice('aiHelp')} />
            <Select label="Preferred report language" placeholder="Select report language" options={['Amharic', 'English', 'Both']} value={choices.reportLanguage} onChange={setChoice('reportLanguage')} />
          </div>
        );
    }
  };

  if (isCompleting) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{scale: 0.7, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          transition={{type: 'spring', stiffness: 260, damping: 18}}
          className="public-accent-bg public-accent flex h-12 w-12 items-center justify-center rounded-2xl">
          <Icon name="copy-success" size={22} />
        </motion.span>
        <TextEffect per="char" preset="fade" speedReveal={3} speedSegment={1.8} className="mt-5 text-xl font-semibold text-heading sm:text-2xl">
          Your workspace is ready.
        </TextEffect>
        <motion.p initial={{opacity: 0}} animate={{opacity: [0, 1, 0.55, 1]}} transition={{delay: 0.55, duration: 1.1}} className="mt-2.5 text-sm text-muted">
          Preparing your first growth dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-8 sm:px-6 sm:pt-10">
        <div className="flex items-center justify-between gap-4">
          <p className="public-accent text-xs font-medium">Step {step + 1} of {onboardingSteps.length}</p>
          <span className="text-xs text-muted">{Math.round(((step + 1) / onboardingSteps.length) * 100)}% complete</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/40">
          <motion.div
            className="public-accent-bg h-full rounded-full"
            initial={false}
            animate={{width: `${((step + 1) / onboardingSteps.length) * 100}%`}}
            transition={{duration: 0.35, ease: 'easeOut'}}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity: 0, x: 18}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -18}} transition={{duration: 0.24, ease: 'easeOut'}} className="mt-5">
            <h2 className="text-xl font-semibold text-heading sm:text-2xl">{onboardingSteps[step].title}</h2>
            <p className="mt-1.5 text-[13px] leading-5 text-muted">{onboardingSteps[step].description}</p>
            <div className="mt-5">{stepContent()}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed bottom nav — Back on the left, Continue on the right, pinned to the viewport instead of living inside the step content. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-6">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-text transition-colors hover:bg-card/50 disabled:pointer-events-none disabled:opacity-0">
            <Icon name="arrow-left2" size={14} />
            Back
          </button>
          <button
            type="button"
            onClick={() => (step === onboardingSteps.length - 1 ? finish() : setStep((current) => current + 1))}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-heading px-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90">
            {step === onboardingSteps.length - 1 ? 'Finish setup' : 'Continue'}
            <Icon name="arrow-right4" size={14} className="text-bg" />
          </button>
        </div>
      </div>
    </>
  );
}

export function AuthExperience({initialStep}: AuthExperienceProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = initialStep === 'signup';

  // Onboarding is a focused, full-page flow: no marketing header, no card — the wizard renders
  // directly on the page background, with its own fixed bottom nav for Back/Continue.
  if (initialStep === 'onboarding') {
    return (
      <main className="min-h-screen bg-bg text-heading">
        <OnboardingWizard />
      </main>
    );
  }

  const pageCopy = copy[initialStep];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    window.setTimeout(() => router.push(isSignup ? '/onboarding' : '/dashboard'), 360);
  };

  return (
    <main className="min-h-screen bg-bg px-4 py-5 text-heading sm:px-6">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Growix home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-heading">
            <Icon name="star2" size={16} className="text-bg" />
          </span>
          <span className="text-sm font-semibold">Growix</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle className="text-muted hover:text-heading" />
          {initialStep === 'login' ? (
            <Link href="/signup" className="rounded-xl px-3 py-2 text-sm font-medium text-text hover:bg-gray hover:text-heading dark:hover:bg-white/10">Create account</Link>
          ) : (
            <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-text hover:bg-gray hover:text-heading dark:hover:bg-white/10">Sign in</Link>
          )}
        </div>
      </header>
      <section className="mx-auto flex min-h-[calc(100dvh-92px)] max-w-6xl items-center justify-center py-10">
        <motion.div
          layout
          initial={{opacity: 0, y: 18}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: 'easeOut'}}
          className="glass-card w-full max-w-[460px] rounded-[24px] p-5 shadow-[0_18px_55px_rgba(25,27,31,0.08)] dark:shadow-[0_18px_55px_rgba(0,0,0,0.25)] sm:p-7">
          <span className="public-accent-bg flex h-10 w-10 items-center justify-center rounded-xl">
            <Icon name={isSignup ? 'user-edit' : 'login'} size={18} />
          </span>
          <p className="public-accent mt-6 text-sm font-medium">{pageCopy.eyebrow}</p>
          <h1 className="mt-2 text-[30px] font-semibold leading-tight text-heading sm:text-[34px]">{pageCopy.title}</h1>
          <p className="mt-3 text-sm leading-6 text-text">{pageCopy.description}</p>
          <form className="mt-7 space-y-4" onSubmit={submit}>
            {isSignup && <Field label="Your name" icon="user" name="name" placeholder="Firo Dey" autoComplete="name" required />}
            <Field label="Email address" icon="email1" name="email" type="email" placeholder="you@business.com" autoComplete="email" required />
            <Field label="Password" icon="lock" name="password" type="password" placeholder="At least 8 characters" autoComplete={isSignup ? 'new-password' : 'current-password'} required />
            <button type="submit" disabled={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-heading text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-55">
              {isSubmitting ? 'Please wait...' : isSignup ? 'Continue to business setup' : 'Sign in'}
              {!isSubmitting && <Icon name="arrow-right4" size={15} className="text-bg" />}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-text">
            {isSignup ? 'Already have an account?' : 'New to Growix?'}{' '}
            <Link href={isSignup ? '/login' : '/signup'} className="font-semibold text-heading underline decoration-border underline-offset-4">
              {isSignup ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}