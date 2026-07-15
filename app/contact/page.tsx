'use client';

import {useState, type FormEvent} from 'react';
import {motion} from 'motion/react';
import {Icon} from '@/components/ui/Icon';
import {PublicHeader} from '@/components/public/PublicHeader';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="public-header-offset min-h-screen bg-bg px-4 pb-14 text-heading sm:px-6 lg:px-8">
      <PublicHeader />
      <section className="mx-auto max-w-5xl pt-8 sm:pt-14">
        <div className="max-w-2xl">
          <p className="public-accent text-sm font-medium">Contact</p>
          <h1 className="mt-3 text-[42px] font-semibold leading-none sm:text-[58px]">Let&apos;s talk about your growth.</h1>
          <p className="mt-5 text-[17px] leading-7 text-text">Questions about Growix, your workspace, or working together? Send a message and the team will get back to you.</p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-3">
            <div className="rounded-2xl glass-card p-5 shadow-[0_10px_30px_rgba(25,27,31,0.035)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <span className="public-accent-bg flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name="email1" size={18} />
              </span>
              <h2 className="mt-5 text-base font-semibold">Email us</h2>
              <a href="mailto:hello@growix.com" className="mt-1 block text-sm text-text hover:text-heading">hello@growix.com</a>
            </div>
            <div className="rounded-2xl glass-card p-5 shadow-[0_10px_30px_rgba(25,27,31,0.035)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <span className="public-muted-bg flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name="conversation-box" size={18} />
              </span>
              <h2 className="mt-5 text-base font-semibold">Need quick guidance?</h2>
              <p className="mt-1 text-sm leading-6 text-text">Browse the help centre for answers about setup and plans.</p>
            </div>
          </aside>
          <motion.form
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.35}}
            onSubmit={submit}
            className="rounded-2xl glass-card p-5 shadow-[0_14px_36px_rgba(25,27,31,0.045)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:p-7">
            {sent ? (
              <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                <span className="public-accent-bg flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Icon name="copy-success" size={22} />
                </span>
                <h2 className="mt-5 text-2xl font-semibold">Message received.</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-text">Thanks for reaching out. We will reply as soon as we can.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Your name</span>
                    <input required className="h-11 w-full rounded-xl border border-border/75 bg-card/75 px-3 text-sm outline-none focus:border-heading/25 focus:ring-2 focus:ring-heading/5 dark:bg-card/85" placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Email address</span>
                    <input required type="email" className="h-11 w-full rounded-xl border border-border/75 bg-card/75 px-3 text-sm outline-none focus:border-heading/25 focus:ring-2 focus:ring-heading/5 dark:bg-card/85" placeholder="you@business.com" />
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium">What can we help with?</span>
                  <textarea required rows={6} className="w-full resize-none rounded-xl border border-border/75 bg-card/75 px-3 py-2.5 text-sm outline-none focus:border-heading/25 focus:ring-2 focus:ring-heading/5 dark:bg-card/85" placeholder="Tell us a little about what you need." />
                </label>
                <button className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-heading px-4 text-sm font-semibold text-bg hover:opacity-90">
                  Send message <Icon name="arrow-right4" size={14} className="text-bg" />
                </button>
              </>
            )}
          </motion.form>
        </div>
      </section>
    </main>
  );
}
