'use client';

import Link from 'next/link';
import {motion} from 'motion/react';
import {useState} from 'react';
import {Icon} from '@/components/ui/Icon';
import {PublicHeader} from '@/components/public/PublicHeader';

const benefits = [
  {icon: 'conversation-box', title: 'Ask with context', text: 'Get practical guidance that starts with your real business, goals, and customers.'},
  {icon: 'status-up', title: 'Plan the next move', text: 'Turn a growth goal into a focused marketing plan with clear next actions.'},
  {icon: 'task', title: 'Keep momentum', text: 'Organize content, campaigns, and decisions in one calm workspace.'},
];

const heroFlows = [
  {icon: 'gps', title: 'Clarify the goal', text: 'Choose what growth looks like now.'},
  {icon: 'status-up', title: 'Build the plan', text: 'Get focused actions and content ideas.'},
  {icon: 'conversation-box', title: 'Keep moving', text: 'Ask, adapt, and share progress.'},
];

const collaborationItems = [
  {icon: 'user', title: 'Shared direction', text: 'Keep owners, marketers, and collaborators looking at the same priorities.'},
  {icon: 'task', title: 'Clear hand-offs', text: 'Turn recommendations into simple tasks your team can actually move forward.'},
  {icon: 'conversation-box', title: 'Decisions in context', text: 'Keep the reasoning behind campaigns, content, and customer ideas in one place.'},
];

const aiPrinciples = [
  {label: 'Built from your inputs', value: 'Your goals, customers, location, and business details guide every recommendation.'},
  {label: 'Practical over generic', value: 'It focuses on concrete next actions, not vague advice or one-size-fits-all templates.'},
  {label: 'Always in your control', value: 'Review, adapt, or ignore any recommendation. You remain the decision-maker.'},
];

const faqs = [
  {question: 'Who is Growix for?', answer: 'Growix is for Ethiopian small businesses and growing teams that want clearer marketing, customer, and planning decisions without needing a large specialist team.'},
  {question: 'Do I need marketing experience to use it?', answer: 'No. Start with the business information you already know. The workspace turns that context into plain-language suggestions, plans, and practical next actions.'},
  {question: 'Can I invite people from my team?', answer: 'Yes. Collaboration features are designed for business owners and the people helping them with marketing, content, and day-to-day growth work.'},
  {question: 'How does the AI use my business information?', answer: 'Your inputs give recommendations useful context, such as your audience, location, products, and goals. You control the information you provide and decide which ideas to use.'},
  {question: 'Is there a free plan?', answer: 'Yes. You can begin with the free workspace and upgrade only when you need more AI planning capacity or room for a larger team.'},
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg text-heading">
      <div className="fixed inset-0 -z-10 bg-bg" />

      <PublicHeader showNav />

      <section className="public-hero-offset relative mx-auto flex min-h-[720px] max-w-[1440px] items-center px-4 pb-16 sm:px-6 lg:min-h-[760px] lg:px-8">
        <div className="absolute inset-x-4 top-28 bottom-6 overflow-hidden rounded-[28px] border border-border/60 bg-gray shadow-[0_18px_55px_rgba(25,27,31,0.08)] dark:shadow-[0_18px_55px_rgba(0,0,0,0.25)] sm:top-32 sm:inset-x-6 lg:top-36 lg:inset-x-8">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2200&q=85"
            alt="A team planning the next stage of their business"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#12221d]/55" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: 'easeOut'}}
            className="text-white">
            <p className="mb-5 flex items-center gap-2 text-sm font-medium text-white/80">
              <span className="h-2 w-2 rounded-full bg-[#e7c5c9]" />
              Business growth, made practical
            </p>
            <h1 className="max-w-2xl text-[42px] font-semibold leading-[1.04] tracking-normal sm:text-[58px] lg:text-[64px]">
              Know your next move.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-7 text-white/85 sm:text-[19px]">
              Growix helps ambitious Ethiopian businesses plan smarter marketing, understand customers, and turn daily work into steady progress.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-heading shadow-sm transition-transform hover:-translate-y-0.5">
                Build your growth plan
                <Icon name="arrow-right4" size={15} />
              </Link>
              <Link href="/assistant" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                <Icon name="conversation-box" size={16} className="text-white" />
                Meet the AI advisor
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.12, ease: 'easeOut'}}
            className="rounded-[24px] glass-card p-3 shadow-[0_22px_55px_rgba(10,20,16,0.2)] backdrop-blur-2xl dark:shadow-[0_22px_55px_rgba(0,0,0,0.35)] sm:p-4">
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/80 px-3 py-3">
              <div className="flex items-center gap-2.5"><span className="public-accent-bg flex h-8 w-8 items-center justify-center rounded-lg"><Icon name="ai-homepage" size={16} /></span><div><p className="text-sm font-semibold text-heading">Your growth workspace</p><p className="text-xs text-muted">A clearer system for the next move</p></div></div>
              <span className="public-accent-bg rounded-lg px-2 py-1 text-xs font-medium">Ready</span>
            </div>
            <div className="mt-3 rounded-xl border border-border/60 bg-card/65 p-4 dark:bg-card/75"><p className="text-xs font-medium text-muted">A simple growth loop</p><div className="mt-4 space-y-2.5">{heroFlows.map((flow, index) => <div key={flow.title} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/75 p-3 dark:bg-card/85"><span className="public-muted-bg flex h-8 w-8 items-center justify-center rounded-lg"><Icon name={flow.icon} size={15} /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium text-heading">{flow.title}</p><p className="mt-0.5 text-xs text-text">{flow.text}</p></div><span className="text-xs font-semibold text-muted">0{index + 1}</span></div>)}</div></div>
            <div className="mt-3 grid grid-cols-2 gap-2"><div className="public-muted-bg rounded-xl p-3"><p className="text-xs text-muted">Plan</p><p className="mt-1 text-sm font-semibold text-heading">Focused actions</p></div><div className="rounded-xl bg-gray p-3 dark:bg-white/5"><p className="text-xs text-muted">Together</p><p className="mt-1 text-sm font-semibold text-heading">Shared context</p></div></div>
          </motion.div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-3 sm:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{opacity: 0, y: 14}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.3}}
              transition={{duration: 0.35, delay: index * 0.06}}
              className="rounded-2xl glass-card p-5 shadow-[0_10px_30px_rgba(25,27,31,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <span className="public-muted-bg flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name={benefit.icon} size={18} />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-heading">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text">{benefit.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-8 border-y border-border/65 py-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:py-14">
          <div>
            <p className="public-accent text-sm font-medium">One connected project</p>
            <h2 className="mt-3 text-[31px] font-semibold leading-tight text-heading sm:text-[40px]">Your business has one story. Your workspace should too.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-text">Growix brings your business profile, customer ideas, marketing plans, content, and progress together so each next step has the context it needs.</p>
            <Link href="/signup" className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-heading px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90">Create your workspace<Icon name="arrow-right4" size={14} className="text-bg" /></Link>
          </div>
          <motion.div initial={{opacity: 0, y: 16}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.25}} transition={{duration: 0.4}} className="rounded-[22px] glass-card p-4 shadow-[0_14px_36px_rgba(25,27,31,0.045)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:p-5">
            <div className="flex items-center justify-between border-b border-border/65 pb-4"><div className="flex items-center gap-2.5"><span className="public-accent-bg flex h-9 w-9 items-center justify-center rounded-xl"><Icon name="ai-homepage" size={17} /></span><div><p className="text-sm font-semibold">Growth workspace</p><p className="text-xs text-muted">Plans, people, and progress together</p></div></div><span className="public-muted-bg rounded-lg px-2.5 py-1 text-xs font-medium public-accent">This week</span></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]"><div className="public-muted-bg rounded-xl p-4"><p className="text-xs text-muted">Main focus</p><p className="mt-2 text-base font-semibold">Bring back returning customers</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border"><span className="block h-full w-[68%] rounded-full bg-[#4e9b7a]" /></div><p className="mt-2 text-xs text-text">68% of this week's plan complete</p></div><div className="space-y-2"><div className="rounded-xl border border-border/60 bg-card/70 p-3 dark:bg-card/80"><p className="text-xs text-muted">Campaign</p><p className="mt-1 text-sm font-medium">Loyalty offer</p></div><div className="rounded-xl border border-border/60 bg-card/70 p-3 dark:bg-card/80"><p className="text-xs text-muted">Content ready</p><p className="mt-1 text-sm font-medium">3 social posts</p></div></div></div>
          </motion.div>
        </div>
      </section>

      <section id="collaboration" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-xl"><p className="public-accent text-sm font-medium">Collaboration that stays useful</p><h2 className="mt-3 text-[31px] font-semibold leading-tight text-heading sm:text-[40px]">Bring people into the work, not another noisy tool.</h2></div><p className="max-w-sm text-sm leading-6 text-text">Make progress visible for the people helping your business grow, while keeping the workspace calm enough to use every day.</p></div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">{collaborationItems.map((item, index) => <motion.article key={item.title} initial={{opacity: 0, y: 12}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.25}} transition={{duration: 0.35, delay: index * 0.06}} className="rounded-2xl glass-card p-5 shadow-[0_10px_30px_rgba(25,27,31,0.035)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"><span className="public-muted-bg flex h-10 w-10 items-center justify-center rounded-xl"><Icon name={item.icon} size={18} /></span><h3 className="mt-5 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-text">{item.text}</p></motion.article>)}</div>
      </section>

      <section id="ai" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="public-panel-border overflow-hidden rounded-[24px] border public-panel-bg shadow-[0_14px_36px_rgba(25,27,31,0.04)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] lg:grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="p-6 sm:p-8"><span className="public-accent-bg flex h-11 w-11 items-center justify-center rounded-xl"><Icon name="ai-send-message" size={19} /></span><p className="public-accent mt-6 text-sm font-medium">AI information</p><h2 className="mt-3 text-[31px] font-semibold leading-tight text-heading sm:text-[40px]">Advice that knows the business behind the question.</h2><p className="mt-4 max-w-md text-sm leading-6 text-text">Growix is designed to help you think through business decisions. It is not a replacement for your judgment, and it makes its work clearer by grounding guidance in the profile you choose to share.</p><Link href="/signup" className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-heading px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90">Set up your AI context<Icon name="arrow-right4" size={14} className="text-bg" /></Link></div>
          <div className="public-panel-border border-t bg-card/40 p-5 sm:p-8 lg:border-l lg:border-t-0 dark:bg-card/50"><div className="space-y-0">{aiPrinciples.map((principle, index) => <div key={principle.label} className={`flex gap-4 py-5 ${index !== 0 ? 'border-t public-panel-border' : ''}`}><span className="public-accent-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">0{index + 1}</span><div><h3 className="text-sm font-semibold text-heading">{principle.label}</h3><p className="mt-1.5 text-sm leading-6 text-text">{principle.value}</p></div></div>)}</div></div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-[24px] glass-card px-5 py-8 shadow-[0_14px_36px_rgba(25,27,31,0.04)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:px-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="public-accent text-sm font-medium">A focused workspace</p>
              <h2 className="mt-3 text-[31px] font-semibold leading-tight text-heading sm:text-[38px]">From question to action, without the noise.</h2>
            </div>
            <Link href="/assistant" className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-heading px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90">
              Ask Growix
              <Icon name="arrow-right4" size={14} className="text-bg" />
            </Link>
          </div>
          <div className="mt-9 grid gap-6 border-t border-border/70 pt-7 sm:grid-cols-3">
            {['Tell us about your business', 'Choose one growth goal', 'Get a plan you can use today'].map((step, index) => (
              <div key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-heading">0{index + 1}</span>
                <p className="pt-0.5 text-sm font-medium leading-6 text-heading">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="public-panel-border flex flex-col items-start justify-between gap-5 rounded-[24px] border public-panel-bg px-5 py-7 shadow-[0_14px_36px_rgba(25,27,31,0.04)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="public-accent text-sm font-medium">Start where you are</p>
            <h2 className="mt-1 text-[26px] font-semibold text-heading">Your first growth plan is free.</h2>
          </div>
          <Link href="/pricing" className="inline-flex h-10 items-center gap-2 rounded-xl bg-heading px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90">
            View pricing
            <Icon name="arrow-right4" size={14} className="text-bg" />
          </Link>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:pb-24">
        <div className="text-center"><p className="public-accent text-sm font-medium">Questions, answered</p><h2 className="mt-3 text-[31px] font-semibold leading-tight text-heading sm:text-[40px]">Frequently asked questions</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text">A few useful details before you set up your workspace.</p></div>
        <div className="mt-8 divide-y divide-border/70 rounded-2xl glass-card px-5 shadow-[0_10px_30px_rgba(25,27,31,0.035)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] sm:px-6">{faqs.map((faq, index) => {const open = openFaq === index; return <div key={faq.question}><button type="button" onClick={() => setOpenFaq(open ? null : index)} aria-expanded={open} className="flex w-full items-center justify-between gap-5 py-5 text-left"><span className="text-sm font-semibold text-heading sm:text-base">{faq.question}</span><span className={`public-muted-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform ${open ? 'rotate-45' : ''}`}><Icon name="add" size={14} /></span></button><motion.div initial={false} animate={{height: open ? 'auto' : 0, opacity: open ? 1 : 0}} transition={{duration: 0.2, ease: 'easeOut'}} className="overflow-hidden"><p className="max-w-2xl pb-5 text-sm leading-6 text-text">{faq.answer}</p></motion.div></div>;})}</div>
        <p className="mt-6 text-center text-sm text-text">Still need a hand? <Link href="/contact" className="font-semibold text-heading underline decoration-border underline-offset-4">Contact the Growix team</Link>.</p>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-medium text-heading">
          <Icon name="star2" size={15} />
          Growix
        </div>
        <div className="flex items-center gap-5">
          <Link href="/about" className="hover:text-heading">About</Link>
          <Link href="/help" className="hover:text-heading">Help</Link>
          <Link href="/contact" className="hover:text-heading">Contact</Link>
          <Link href="/login" className="hover:text-heading">Sign in</Link>
          <Link href="/signup" className="hover:text-heading">Get started</Link>
        </div>
      </footer>
    </main>
  );
}
