'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/Button';
import {Card} from '@/components/ui/Card';
import {usePageLoading} from '@/hooks/usePageLoading';
import {DiscoverSkeleton} from '@/components/discover/DiscoverSkeleton';

const categories = [
  {name: 'Tech', emoji: '💻', count: '3K Events', color: 'bg-yellow-100'},
  {name: 'Food & Drink', emoji: '🍜', count: '423 Events', color: 'bg-orange-100'},
  {name: 'AI', emoji: '🧠', count: '3K Events', color: 'bg-pink-100'},
  {name: 'Arts & Culture', emoji: '🎨', count: '2K Events', color: 'bg-green-100'},
  {name: 'Climate', emoji: '🌍', count: '675 Events', color: 'bg-emerald-100'},
  {name: 'Fitness', emoji: '🏃', count: '2K Events', color: 'bg-red-100'},
  {name: 'Wellness', emoji: '🧘', count: '1K Events', color: 'bg-teal-100'},
  {name: 'Crypto', emoji: '₿', count: '503 Events', color: 'bg-purple-100'},
];

const featuredCalendars = [
  {
    name: 'Reading Rhythms Global',
    description: 'We gather in local communities to read, reflect, and connect.',
    emoji: '📚',
  },
  {
    name: 'Design Buddies',
    description: 'Events for designers and all creatives across SF, online, and the world.',
    emoji: '🐰',
  },
  {
    name: 'Build Club',
    description: 'The most collaborative AI community in the world (50+ Cities, 30K+ community).',
    emoji: '🏗️',
    slug: 'build-club',
  },
  {
    name: 'Cursor Community',
    description: 'Cursor community meetups, hackathons, workshops taking place around the world.',
    emoji: '⚡',
  },
  {
    name: 'South Park Commons',
    description: 'South Park Commons helps you get from -1 to 0.',
    emoji: '🏠',
  },
  {
    name: 'OpenClaw',
    description: 'A community for builders, hackers, and anyone curious about AI agents.',
    emoji: '🦞',
  },
];

export function DiscoverPage() {
  const isLoading = usePageLoading();

  if (isLoading) return <DiscoverSkeleton />;

  return (
    <div className="page-container">
      <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight mb-3">
        Discover Events
      </h1>
      <p className="text-sm text-text leading-relaxed mb-8 max-w-lg">
        Explore popular events near you, browse by category, or check out some of the great
        community calendars.
      </p>

      <h2 className="text-base font-semibold text-heading mb-4">Browse by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/60 hover:shadow-sm transition-all duration-300 cursor-pointer text-left">
            <span className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-lg shrink-0`}>
              {cat.emoji}
            </span>
            <div>
              <p className="text-sm font-semibold text-heading">{cat.name}</p>
              <p className="text-xs text-muted">{cat.count}</p>
            </div>
          </button>
        ))}
      </div>

      <h2 className="text-[22px] sm:text-[28px] font-semibold text-heading mb-6">
        Featured Calendars
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredCalendars.map((cal) => (
          <div key={cal.name}>
            <Card padding="md" className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-gray flex items-center justify-center text-lg">
                  {cal.emoji}
                </span>
                <Button variant="gray" size="sm" className="text-xs">
                  Follow
                </Button>
              </div>
              {cal.slug ? (
                <Link href={`/calendar/${cal.slug}`} className="hover:underline">
                  <h3 className="text-sm font-semibold text-heading mb-1.5">{cal.name}</h3>
                </Link>
              ) : (
                <h3 className="text-sm font-semibold text-heading mb-1.5">{cal.name}</h3>
              )}
              <p className="text-xs text-text leading-relaxed line-clamp-2 flex-1">
                {cal.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
