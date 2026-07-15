'use client';

import Link from 'next/link';
import {motion} from 'motion/react';
import {Card} from '@/components/ui/Card';
import {Icon} from '@/components/ui/Icon';
import {DashboardSkeleton} from '@/components/dashboard/DashboardSkeleton';
import {usePageLoading} from '@/hooks/usePageLoading';
import {cn} from '@/lib/utils';

const quickActions = [
  {label: 'Ask the AI advisor', detail: 'Work through a decision or idea', href: '/assistant', icon: 'conversation-box'},
  {label: 'Build a campaign', detail: 'Turn a goal into a plan', href: '/marketing', icon: 'status-up'},
  {label: 'Create content', detail: 'Draft posts for your channels', href: '/content', icon: 'document-text'},
];

const milestones = [
  {label: 'Business profile', detail: 'Your foundations are in place', status: 'Complete', complete: true},
  {label: 'Customer targeting', detail: 'Add two customer groups to strengthen recommendations', status: 'In progress', complete: false},
  {label: 'First campaign', detail: 'Ready when your audience is set', status: 'Next', complete: false},
];

const businessDetails = [
  {label: 'Industry', value: 'Food and beverage', icon: 'ai-homepage'},
  {label: 'Location', value: 'Addis Ababa, Ethiopia', icon: 'location'},
  {label: 'Main goal', value: 'Grow repeat customers', icon: 'status-up'},
];

function DCard({className, ...props}: React.ComponentProps<typeof Card>) {
  return <Card className={cn('!rounded-[24px] bg-[#FDFEFE] shadow-[0_8px_24px_rgba(25,27,31,0.025)] dark:bg-card', className)} {...props} />;
}

export function DashboardPage() {
  const isLoading = usePageLoading();
  if (isLoading) return <DashboardSkeleton />;

  return <div className="page-container mx-auto max-w-6xl space-y-7 pb-8">
    <motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}} className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-muted">Dashboard</p><h1 className="mt-1 text-[30px] font-semibold leading-tight text-heading sm:text-[34px]">Good morning, Firo.</h1><p className="mt-2 text-sm text-muted">Here is a clear view of your business and what to work on next.</p></div><Link href="/assistant" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-btn-dark px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:text-[#191B1F]"><Icon name="conversation-box" size={16} />Ask AI advisor</Link></motion.section>

    <motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3, delay: 0.04}} className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]"><DCard padding="none" className="overflow-hidden"><div className="border-b border-border/60 px-5 py-5 sm:px-6"><div className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray text-heading"><Icon name="ai-homepage" size={20} /></span><div className="min-w-0"><p className="truncate text-base font-semibold text-heading">Selam Coffee House</p><p className="mt-1 text-xs text-muted">Business profile</p></div></div><Link href="/settings" className="rounded-xl bg-gray px-3 py-2 text-xs font-medium text-heading transition-colors hover:bg-border">Edit</Link></div></div><div className="divide-y divide-border/60">{businessDetails.map((detail) => <div key={detail.label} className="flex items-center gap-3 px-5 py-3.5 sm:px-6"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray text-muted"><Icon name={detail.icon} size={15} /></span><div><p className="text-xs text-muted">{detail.label}</p><p className="mt-0.5 text-sm font-medium text-heading">{detail.value}</p></div></div>)}</div></DCard><DCard padding="lg" className="border-[#c9ded4] bg-[#edf4f0] dark:border-[#2c4a3d] dark:bg-[#17261f]"><p className="text-sm font-medium text-[#28745d] dark:text-[#76c9a6]">Today&apos;s focus</p><h2 className="mt-2 max-w-xl text-[24px] font-semibold leading-tight text-heading sm:text-[29px]">Give returning customers a reason to come back this week.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-text">A short loyalty offer is a practical way to reconnect with people who already know your business.</p><div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/75 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray text-heading"><Icon name="task" size={17} /></span><div><p className="text-sm font-semibold text-heading">Create a simple loyalty offer</p><p className="mt-0.5 text-xs text-muted">Your next recommended action</p></div></div><div className="flex gap-2"><Link href="/marketing" className="inline-flex h-9 items-center gap-2 rounded-xl bg-btn-dark px-3 text-sm font-medium text-white hover:opacity-90 dark:text-[#191B1F]">Create <Icon name="arrow-right4" size={13} /></Link><Link href="/assistant" className="inline-flex h-9 items-center rounded-xl bg-gray px-3 text-sm font-medium text-heading hover:bg-border">Ideas</Link></div></div></DCard></motion.section>

    <section className="grid gap-3 sm:grid-cols-3"><DCard padding="md"><p className="text-sm text-muted">Growth score</p><div className="mt-4 flex items-end gap-2"><p className="text-[34px] font-semibold leading-none text-heading">78</p><span className="pb-1 text-xs text-muted">of 100</span></div><p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">You are building a strong foundation.</p></DCard><DCard padding="md"><p className="text-sm text-muted">Plan progress</p><p className="mt-4 text-[34px] font-semibold leading-none text-heading">68%</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray"><span className="block h-full w-[68%] rounded-full bg-emerald-500" /></div><p className="mt-3 text-xs text-muted">This week&apos;s priorities are moving.</p></DCard><DCard padding="md"><p className="text-sm text-muted">Active channels</p><p className="mt-4 text-[34px] font-semibold leading-none text-heading">03</p><p className="mt-3 text-xs text-muted">Instagram, Facebook, and Telegram.</p></DCard></section>

    <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]"><motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3, delay: 0.1}}><div className="mb-3"><h2 className="text-base font-semibold text-heading">Start something useful</h2><p className="mt-1 text-sm text-muted">Choose a focused place to continue your work.</p></div><div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">{quickActions.map((action) => <Link key={action.label} href={action.href} className="group"><DCard padding="md" className="flex h-full items-center gap-3 transition-colors hover:bg-gray/35"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray text-heading"><Icon name={action.icon} size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-heading">{action.label}</p><p className="mt-1 text-xs text-muted">{action.detail}</p></div><Icon name="arrow-right4" size={14} className="text-muted transition-transform group-hover:translate-x-0.5" /></DCard></Link>)}</div></motion.section><motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3, delay: 0.14}}><div className="mb-3 flex items-center justify-between"><div><h2 className="text-base font-semibold text-heading">Your growth path</h2><p className="mt-1 text-sm text-muted">A few foundations make the AI more useful.</p></div><span className="rounded-xl bg-gray px-2.5 py-1 text-xs font-medium text-heading">1 next step</span></div><DCard padding="none" className="overflow-hidden">{milestones.map((milestone) => <div key={milestone.label} className="flex items-center gap-3 border-b border-border/60 px-4 py-4 last:border-b-0"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${milestone.complete ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-gray text-muted'}`}><Icon name={milestone.complete ? 'copy-success' : 'arrow-right4'} size={14} /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-heading">{milestone.label}</p><p className="mt-0.5 text-xs leading-5 text-muted">{milestone.detail}</p></div><span className={`text-xs font-medium ${milestone.complete ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'}`}>{milestone.status}</span></div>)}</DCard></motion.section></div>
  </div>;
}
