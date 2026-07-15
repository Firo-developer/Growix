'use client';

import {useState} from 'react';
import {Icon} from '@/components/ui/Icon';
import {Button} from '@/components/ui/Button';
import {TabSwitcher} from '@/components/ui/TabSwitcher';
import {AnimatedTabPanel} from '@/components/ui/AnimatedTabPanel';
import {usePageLoading} from '@/hooks/usePageLoading';
import {EventsSkeleton} from '@/components/events/EventsSkeleton';

export function EventsPage() {
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState('upcoming');

  if (isLoading) return <EventsSkeleton />;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight">
          Events
        </h1>
        <TabSwitcher
          tabs={[
            {id: 'upcoming', label: 'Upcoming'},
            {id: 'past', label: 'Past'},
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <AnimatedTabPanel activeTab={activeTab}>
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gray flex items-center justify-center">
              <Icon name="calendar" size={36} className="opacity-30" />
            </div>
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray text-xs font-semibold text-muted flex items-center justify-center border-2 border-bg">
              0
            </span>
          </div>
          <h2 className="text-lg font-semibold text-heading mb-2">
            {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
          </h2>
          <p className="text-sm text-text mb-6 max-w-xs">
            {activeTab === 'upcoming'
              ? 'You have no upcoming events. Why not host one?'
              : 'You have no past events yet.'}
          </p>
          <Button variant="dark" size="md">
            <Icon name="add" size={16} className="brightness-0 invert" />
            Create Event
          </Button>
        </div>
      </AnimatedTabPanel>
    </div>
  );
}
