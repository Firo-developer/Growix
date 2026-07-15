'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Icon} from '@/components/ui/Icon';
import {Button} from '@/components/ui/Button';
import {Card} from '@/components/ui/Card';
import {usePageLoading} from '@/hooks/usePageLoading';
import {CalendarsSkeleton} from '@/components/calendars/CalendarsSkeleton';

const onboardingSlides = [
  {
    title: 'Welcome to Luma Calendar',
    description:
      'Luma Calendar lets you easily share and manage your events. Every event on Luma is part of a calendar. Let\'s see how they work.',
    icon: 'calendar' as const,
  },
  {
    title: 'Create Beautiful Pages',
    description:
      'Create a beautiful calendar page in under a minute. Perfect for clubs, classes, groups, and everything in between.',
    icon: 'document' as const,
  },
  {
    title: 'Share Your Events',
    description:
      'Share your calendar link and let people discover and follow your events effortlessly.',
    icon: 'location' as const,
  },
  {
    title: 'Send Newsletters',
    description:
      'As guests follow your Calendar, you can send them newsletters to keep them in the loop.',
    icon: 'send' as const,
  },
  {
    title: 'Grow Your Community',
    description:
      'Track followers, manage guests, and build a thriving community around your calendar.',
    icon: 'user' as const,
  },
];

export function CalendarsPage() {
  const isLoading = usePageLoading();
  const [slideIndex, setSlideIndex] = useState(0);

  if (isLoading) return <CalendarsSkeleton />;

  const slide = onboardingSlides[slideIndex];

  return (
    <div className="page-container">
      <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight mb-8">
        Calendars
      </h1>

      <Card padding="lg" className="mb-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gray flex items-center justify-center shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.9}}
                transition={{duration: 0.35}}>
                <Icon name={slide.icon} size={56} className="opacity-40" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{opacity: 0, x: 10}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -10}}
                transition={{duration: 0.35}}>
                <h2 className="text-lg font-semibold text-heading mb-2">{slide.title}</h2>
                <p className="text-sm text-text leading-relaxed mb-4">{slide.description}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {onboardingSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      i === slideIndex ? 'w-5 bg-heading' : 'w-3 bg-gray'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="dark"
                size="sm"
                onClick={() => setSlideIndex((i) => (i + 1) % onboardingSlides.length)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-heading">My Calendars</h2>
        <Button variant="gray" size="sm">
          <Icon name="add" size={14} />
          Create
        </Button>
      </div>

      <Card padding="lg" className="text-center py-10">
        <div className="w-14 h-14 rounded-xl bg-gray flex items-center justify-center mx-auto mb-4 relative">
          <Icon name="calendar" size={28} className="opacity-30" />
          <span className="absolute -top-1 -right-1 text-[10px] font-bold text-muted">0</span>
        </div>
        <h3 className="text-base font-semibold text-heading mb-1">No Calendars</h3>
        <p className="text-sm text-muted">You are not an admin of any calendars.</p>
      </Card>
    </div>
  );
}
