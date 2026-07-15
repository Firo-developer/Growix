import Link from 'next/link';
import {Icon} from '@/components/ui/Icon';
import {PublicHeader} from '@/components/public/PublicHeader';

const helpTopics = [
  {icon: 'ai-homepage', title: 'Set up your workspace', text: 'Start with business information, goals, and preferences.'},
  {icon: 'conversation-box', title: 'Work with Growix', text: 'Learn how to ask for plans, ideas, and next actions.'},
  {icon: 'status-up', title: 'Plans and billing', text: 'Understand Free, Pro, add-ons, and managing your plan.'},
  {icon: 'user', title: 'Invite collaborators', text: 'Bring people into the right conversations and tasks.'},
];

export default function HelpPage() {
  return (
    <main className="public-header-offset min-h-screen bg-bg px-4 pb-14 text-heading sm:px-6 lg:px-8">
      <PublicHeader />
      <section className="mx-auto max-w-5xl pt-8 sm:pt-14">
        <div className="text-center">
          <p className="public-accent text-sm font-medium">Help centre</p>
          <h1 className="mt-3 text-[42px] font-semibold leading-none sm:text-[58px]">How can we help?</h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-text">Find the essentials for setting up, planning, and getting more from your workspace.</p>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {helpTopics.map((topic) => (
            <article key={topic.title} className="rounded-2xl glass-card p-5 shadow-[0_10px_30px_rgba(25,27,31,0.035)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <span className="public-muted-bg flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name={topic.icon} size={18} />
              </span>
              <h2 className="mt-5 text-lg font-semibold">{topic.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text">{topic.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl glass-card p-5 text-sm text-text sm:flex-row sm:items-center sm:p-6">
          <span>Didn&apos;t find what you need?</span>
          <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-heading">
            Contact support <Icon name="arrow-right4" size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
