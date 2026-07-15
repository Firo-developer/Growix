import Link from 'next/link';
import {Icon} from '@/components/ui/Icon';
import {PublicHeader} from '@/components/public/PublicHeader';

const values = [
  {icon: 'conversation-box', title: 'Useful clarity', text: 'We make complex business questions easier to work through.'},
  {icon: 'user', title: 'Built with local context', text: 'The product starts from the realities of Ethiopian businesses and their customers.'},
  {icon: 'task', title: 'Progress over promises', text: 'Every feature should help a business take a practical next step.'},
];

export default function AboutPage() {
  return (
    <main className="public-header-offset min-h-screen bg-bg px-4 pb-14 text-heading sm:px-6 lg:px-8">
      <PublicHeader />
      <section className="mx-auto max-w-5xl pt-8 sm:pt-14">
        <p className="public-accent text-sm font-medium">About EthioGrowth</p>
        <h1 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[1.04] sm:text-[60px]">A calmer way for growing businesses to make their next move.</h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-7 text-text">EthioGrowth brings business planning, marketing direction, and AI-supported guidance into one practical workspace. It is built to help owners move from uncertainty to useful action.</p>
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-2xl glass-card p-5 shadow-[0_10px_30px_rgba(25,27,31,0.035)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <span className="public-muted-bg flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name={value.icon} size={18} />
              </span>
              <h2 className="mt-5 text-lg font-semibold">{value.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text">{value.text}</p>
            </article>
          ))}
        </div>
        <div className="public-panel-border mt-12 rounded-2xl border public-panel-bg p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="public-accent text-sm font-medium">Ready to begin?</p>
            <h2 className="mt-1 text-2xl font-semibold">Create a workspace around your business.</h2>
          </div>
          <Link href="/signup" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-heading px-4 text-sm font-semibold text-bg sm:mt-0">
            Start free <Icon name="arrow-right4" size={14} className="text-bg" />
          </Link>
        </div>
      </section>
    </main>
  );
}
