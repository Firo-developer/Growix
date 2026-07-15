'use client';

import {useEffect, useState} from 'react';
import {Icon} from '@/components/ui/Icon';
import {Button} from '@/components/ui/Button';
import {usePageLoading} from '@/hooks/usePageLoading';
import {ProfileSkeleton} from '@/components/profile/ProfileSkeleton';

function formatTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}

export function ProfilePage() {
  const isLoading = usePageLoading(1500);
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const interval = setInterval(() => setTime(formatTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="page-container">
      <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-0 bg-gradient-to-br from-gray via-[#E8E8E8] to-gray">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-6xl opacity-20">🌐</div>
      </div>

      <div className="relative -mt-10 flex items-end justify-between mb-6">
        <div className="w-20 h-20 rounded-2xl bg-card border-4 border-bg flex items-center justify-center shadow-sm">
          <div className="text-center">
            <div className="flex gap-0.5 justify-center mb-0.5">
              <span className="text-blue-500 font-bold text-xs">+</span>
              <span className="text-orange-500 font-bold text-xs">−</span>
              <span className="text-purple-500 font-bold text-xs">●</span>
            </div>
            <span className="text-[8px] font-bold text-heading tracking-wider">BUILD CLUB</span>
          </div>
        </div>
        <Button variant="gray" size="sm">
          Follow
        </Button>
      </div>

      <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight mb-2">
        Build Club
      </h1>

      <div className="flex items-center gap-2 text-sm text-muted mb-4">
        <Icon name="clock" size={16} className="opacity-50" />
        <span>Times in GMT+3 — {time}</span>
      </div>

      <p className="text-sm text-text leading-relaxed mb-6 max-w-lg">
        The most collaborative AI community in the world (50+ Cities, 30K+ community).
      </p>

      <div className="flex items-center gap-3">
        {['𝕏', 'in', '🌐'].map((icon) => (
          <button
            key={icon}
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center text-xs font-medium text-muted hover:bg-[#E0E0E0] transition-colors duration-300 cursor-pointer">
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
