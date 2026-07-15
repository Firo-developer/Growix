'use client';

import Link from 'next/link';
import {useState} from 'react';
import {motion} from 'motion/react';
import {Icon} from '@/components/ui/Icon';
import {PublicHeader} from '@/components/public/PublicHeader';

const starterGroups = [
  ['Plan and organise your growth', 'One business workspace', 'AI growth recommendations', 'Monthly marketing plan', 'Content planning tools', 'Customer profile basics'],
  ['Run your day-to-day marketing', 'Three AI-assisted campaigns per month', 'Social media content ideas', 'Local market guidance', 'Email support'],
  ['Keep your team aligned', 'One business owner seat', 'Simple progress tracking', 'Export your core plan'],
];

const growthGroups = [
  ['Everything in Starter, plus', 'Unlimited AI planning sessions', 'Detailed customer insights', 'Campaign performance tracking', 'Brand voice guidance', 'Competitor-aware suggestions'],
  ['Move faster with your team', 'Up to five team members', 'Shared campaign workspace', 'Priority recommendations', 'Exportable business reports'],
  ['More support when it matters', 'Priority support', 'Early access to new AI tools', 'Quarterly growth check-in'],
];

function FeatureGroup({items}: {items: string[]}) {
  return (
    <div className="border-t border-border/65 pt-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-sm text-muted">{items[0]}</p>
      <ul className="space-y-3">
        {items.slice(1).map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm leading-5 text-text">
            <Icon name="copy-success" size={16} className="mt-0.5 public-accent" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const growthPrice = annual ? '$19' : '$24';

  return (
    <main className="public-header-offset min-h-screen bg-bg px-4 pb-14 text-heading sm:px-6 lg:px-8">
      <PublicHeader />

      <section className="mx-auto max-w-5xl pt-8 text-center sm:pt-14">
        <h1 className="text-[44px] font-semibold leading-none text-heading sm:text-[64px]">Pricing</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-7 text-text">Use EthioGrowth free while you build your foundation. Upgrade when your plans, campaigns, and team need more room.</p>
        <div className="mt-7 inline-flex rounded-xl border border-border/70 glass-card p-1 shadow-sm">
          <button type="button" onClick={() => setAnnual(false)} className={`h-9 rounded-lg px-4 text-sm font-medium transition-colors ${!annual ? 'bg-card text-heading shadow-sm' : 'text-muted'}`}>Monthly</button>
          <button type="button" onClick={() => setAnnual(true)} className={`h-9 rounded-lg px-4 text-sm font-medium transition-colors ${annual ? 'bg-card text-heading shadow-sm' : 'text-muted'}`}>Annual</button>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-2">
        <motion.article initial={{opacity: 0, y: 14}} animate={{opacity: 1, y: 0}} transition={{duration: 0.35}} className="rounded-2xl glass-card p-5 shadow-[0_14px_36px_rgba(25,27,31,0.045)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:p-6">
          <p className="text-base font-semibold">EthioGrowth</p>
          <p className="mt-4 text-[42px] font-semibold leading-none">Free</p>
          <p className="mt-2 text-sm text-text">Free, forever for one business.</p>
          <Link href="/signup" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-heading text-sm font-semibold text-bg hover:opacity-90">Get started</Link>
          <div className="mt-6 space-y-6">{starterGroups.map((group) => <FeatureGroup key={group[0]} items={group} />)}</div>
        </motion.article>
        <motion.article initial={{opacity: 0, y: 14}} animate={{opacity: 1, y: 0}} transition={{duration: 0.35, delay: 0.07}} className="public-panel-border rounded-2xl border public-panel-bg p-5 shadow-[0_14px_36px_rgba(25,27,31,0.055)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="public-accent text-base font-semibold">EthioGrowth Pro</p>
            <span className="public-accent-bg rounded-lg px-2.5 py-1 text-xs font-medium">Best for growth</span>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <p className="text-[42px] font-semibold leading-none">{growthPrice}</p>
            <p className="pb-1 text-sm text-text">per month</p>
          </div>
          <p className="mt-2 text-sm text-text">{annual ? 'Billed annually.' : 'Billed monthly.'} For businesses building a stronger rhythm.</p>
          <Link href="/signup" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-heading text-sm font-semibold text-bg hover:opacity-90">Start Pro</Link>
          <div className="mt-6 space-y-6">{growthGroups.map((group) => <FeatureGroup key={group[0]} items={group} />)}</div>
        </motion.article>
      </section>

      <p className="mx-auto mt-5 max-w-5xl px-1 text-xs leading-5 text-muted">Prices are shown in USD. Annual billing saves more than paying month to month. You can change or cancel your plan whenever your needs change.</p>

      <section className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl glass-card shadow-[0_14px_36px_rgba(25,27,31,0.035)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:grid sm:grid-cols-[0.92fr_1fr]">
        <div className="p-5 sm:p-7">
          <span className="public-accent-bg flex h-10 w-10 items-center justify-center rounded-xl"><Icon name="send" size={17} /></span>
          <h2 className="mt-4 text-xl font-semibold">Add-ons</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-text">Pro includes room for your regular marketing. Add more AI campaign capacity as your business picks up pace.</p>
          <p className="mt-12 text-xs text-muted">You can always continue planning your business, even without add-ons.</p>
        </div>
        <div className="border-t border-border/70 bg-card/35 p-5 sm:border-l sm:border-t-0 sm:p-7 dark:bg-card/50">
          <div className="flex items-center justify-between border-b border-border/70 pb-3 text-xs font-medium text-muted"><span>Monthly campaign capacity</span><span>Price</span></div>
          {[['10 campaigns', 'Included'], ['25 campaigns', '$5/mo'], ['50 campaigns', '$12/mo'], ['100 campaigns', '$20/mo'], ['250 campaigns', '$45/mo']].map(([capacity, price]) => (
            <div key={capacity} className="flex items-center justify-between border-b border-border/50 py-3 text-sm text-text">
              <span>{capacity}</span>
              <span className="font-medium text-heading">{price}</span>
            </div>
          ))}
          <p className="mt-4 text-right text-xs text-muted">Billed with your selected plan.</p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl glass-card shadow-[0_14px_36px_rgba(25,27,31,0.03)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-3">
            <span className="public-muted-bg mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl"><Icon name="star2" size={16} /></span>
            <div>
              <h2 className="text-lg font-semibold">Enterprise</h2>
              <p className="mt-1 text-sm text-text">Need tailored onboarding, multiple businesses, or a dedicated team workspace?</p>
            </div>
          </div>
          <Link href="/signup" className="inline-flex h-10 items-center justify-center rounded-xl bg-heading px-4 text-sm font-semibold text-bg hover:opacity-90">Contact us</Link>
        </div>
        <div className="border-t border-border/65 px-5 py-3 text-xs text-muted sm:px-7">Multi-business accounts · Advanced team roles · Tailored reporting · Priority onboarding · Dedicated support</div>
      </section>

      <footer className="mx-auto mt-20 flex max-w-5xl flex-col gap-4 border-t border-border/65 pt-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-heading">EthioGrowth</span>
          <Link href="/" className="hover:text-heading">Home</Link>
          <Link href="/pricing" className="hover:text-heading">Pricing</Link>
          <Link href="/signup" className="hover:text-heading">Get started</Link>
        </div>
        <span>Made for practical business growth.</span>
      </footer>
    </main>
  );
}
