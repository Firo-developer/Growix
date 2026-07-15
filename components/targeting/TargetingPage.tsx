'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Badge} from '@/components/ui/Badge';
import {Progress} from '@/components/ui/Progress';
import {usePageLoading} from '@/hooks/usePageLoading';
import {cn} from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

const personas = [
  {
    id: 1,
    emoji: '👩‍💼',
    name: 'Urban Professional',
    age: '25–35',
    location: 'Addis Ababa, Bole & CMC',
    income: 'ETB 15,000–40,000 / mo',
    interests: ['Specialty coffee', 'Remote work', 'Wellness'],
    pain: 'No time for breakfast — needs quick, quality food on the go.',
    fit: 92,
    color: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200/60 dark:border-violet-800/40',
  },
  {
    id: 2,
    emoji: '🎓',
    name: 'University Student',
    age: '18–24',
    location: 'Near AAU, Sidist Kilo',
    income: 'ETB 3,000–8,000 / mo',
    interests: ['Studying', 'Affordable eats', 'Social spaces'],
    pain: 'Limited budget but craves a cozy space to study with friends.',
    fit: 78,
    color: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200/60 dark:border-amber-800/40',
  },
  {
    id: 3,
    emoji: '🧑‍💻',
    name: 'Freelancer / Creator',
    age: '22–38',
    location: 'Kazanchis, Piassa',
    income: 'ETB 8,000–25,000 / mo',
    interests: ['Co-working', 'Fast WiFi', 'Design & tech'],
    pain: 'Needs a productive environment outside home without high café fees.',
    fit: 85,
    color: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200/60 dark:border-emerald-800/40',
  },
];

const segments = [
  {label: 'Age 25–35', value: 48, icon: 'user'},
  {label: 'Age 18–24', value: 31, icon: 'user'},
  {label: 'Age 36–50', value: 14, icon: 'user'},
  {label: 'Other', value: 7, icon: 'information'},
];

const channels = [
  {name: 'Instagram', icon: 'instagram', reach: '12.4K', fit: 94, color: 'text-pink-500'},
  {name: 'Telegram', icon: 'direct-right', reach: '8.1K', fit: 88, color: 'text-blue-500'},
  {name: 'Facebook', icon: 'global', reach: '6.7K', fit: 72, color: 'text-blue-600'},
  {name: 'TikTok', icon: 'microphone', reach: '4.9K', fit: 61, color: 'text-heading'},
];

const savedSearches = [
  {label: 'Urban Addis, age 22–35', count: '~18,400 people', icon: 'gps'},
  {label: 'Coffee lovers, Bole district', count: '~6,200 people', icon: 'location'},
  {label: 'Students near AAU', count: '~11,300 people', icon: 'medal'},
];

// ─── Components ──────────────────────────────────────────────────────────────

/** Shared card style: 24 px radius + #FDFEFE background */
function DCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn('!rounded-[24px] bg-[#FDFEFE] dark:bg-card', className)}
      {...props}
    />
  );
}

function PersonaCard({p, onClick}: {p: typeof personas[0]; onClick: () => void}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-3 p-5 rounded-xl border text-left w-full hover:shadow-sm transition-all duration-200 cursor-pointer',
        p.color, p.border,
      )}>
      <div className="flex items-start justify-between w-full gap-3">
        <span className="text-3xl leading-none">{p.emoji}</span>
        <Badge variant="outline" className="shrink-0">{p.fit}% match</Badge>
      </div>
      <div>
        <p className="text-sm font-semibold text-heading">{p.name}</p>
        <p className="text-xs text-muted mt-0.5">{p.age} · {p.location}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {p.interests.map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-white/60 dark:bg-black/20 text-text border border-border/30">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted leading-relaxed border-t border-border/30 pt-3 w-full">
        {p.pain}
      </p>
    </button>
  );
}

function PersonaDetail({p, onClose}: {p: typeof personas[0]; onClose: () => void}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: 10}}
      transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}>
      <DCard padding="none" className={cn('border overflow-hidden', p.border)}>
        {/* Header */}
        <div className={cn('flex items-center gap-4 p-5 border-b border-border/60', p.color)}>
          <span className="text-4xl leading-none">{p.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-heading">{p.name}</p>
            <p className="text-xs text-muted mt-0.5">{p.age} · {p.location} · {p.income}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">{p.fit}% match</Badge>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer">
              <Icon name="x" size={14} className="opacity-50" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-border/60">
          <div className="p-5 flex items-start gap-4">
            <Icon name="lamp-on" size={18} className="opacity-40 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-heading mb-1">Core Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {p.interests.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-gray text-text">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5 flex items-start gap-4">
            <Icon name="information" size={18} className="opacity-40 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-heading mb-1">Primary Pain Point</p>
              <p className="text-sm text-text leading-relaxed">{p.pain}</p>
            </div>
          </div>
          <div className="p-5 flex items-start gap-4">
            <Icon name="status-up" size={18} className="opacity-40 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-heading mb-2">Audience Fit Score</p>
              <div className="flex items-center gap-3">
                <Progress value={p.fit} className="flex-1" />
                <span className="text-sm font-semibold text-heading shrink-0">{p.fit}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 flex items-center gap-2 bg-gray/30">
          <Button variant="dark" size="sm">
            <Icon name="status-up" size={14} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
            Build Campaign
          </Button>
          <Button variant="gray" size="sm">
            <Icon name="edit" size={14} className="opacity-60" />
            Edit Persona
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            <Icon name="export-arrow2" size={14} className="opacity-50" />
            Export
          </Button>
        </div>
      </DCard>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function TargetingPage() {
  const isLoading = usePageLoading();
  const [selectedPersona, setSelectedPersona] = useState<typeof personas[0] | null>(null);
  const [generating, setGenerating] = useState(false);

  if (isLoading) {
    return (
      <div className="page-container space-y-6">
        <div className="h-9 w-56 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-80 rounded skeleton-shimmer" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <div key={i} className="h-52 rounded-xl skeleton-shimmer" />)}
        </div>
        <div className="h-64 rounded-lg skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{opacity: 0, y: 8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gray flex items-center justify-center">
                <Icon name="gps" size={15} className="opacity-60" />
              </div>
              <p className="text-sm text-muted">AI Targeting</p>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight">
              Customer Targeting
            </h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Define your ideal customers and build AI-generated personas tailored to your Ethiopian business.
            </p>
          </div>
          <Button
            variant="dark"
            size="md"
            className="shrink-0 self-start sm:self-auto"
            onClick={() => {
              setGenerating(true);
              setTimeout(() => setGenerating(false), 2500);
            }}
            disabled={generating}>
            {generating ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Icon name="gps" size={15} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                Generate Personas
              </>
            )}
          </Button>
        </div>

        <div className="space-y-10">

          {/* ── Audience Overview ─────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-heading">Audience Overview</h2>
              <Badge variant="info">AI Estimated</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                {label: 'Total Reach', value: '~42K', icon: 'discover', sub: 'Addis Ababa'},
                {label: 'Primary Age', value: '22–35', icon: 'user', sub: '79% of audience'},
                {label: 'Top Channel', value: 'Instagram', icon: 'instagram', sub: '94% fit score'},
                {label: 'Personas', value: '3', icon: 'layer', sub: 'AI generated'},
              ].map((stat) => (
                <DCard key={stat.label} padding="md" className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={stat.icon} size={15} className="opacity-40 shrink-0" />
                    <p className="text-[11px] text-muted truncate">{stat.label}</p>
                  </div>
                  <p className="text-xl font-semibold text-heading leading-none">{stat.value}</p>
                  <p className="text-[11px] text-muted">{stat.sub}</p>
                </DCard>
              ))}
            </div>

            {/* Age distribution */}
            <DCard padding="lg">
              <p className="text-xs font-semibold text-heading mb-4">Age Distribution</p>
              <div className="space-y-3">
                {segments.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-3">
                    <p className="text-xs text-muted w-20 shrink-0">{seg.label}</p>
                    <Progress value={seg.value} className="flex-1" />
                    <p className="text-xs font-medium text-heading w-8 text-right shrink-0">{seg.value}%</p>
                  </div>
                ))}
              </div>
            </DCard>
          </section>

          {/* ── Customer Personas ─────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-heading">Customer Personas</h2>
                <p className="text-xs text-muted mt-0.5">Click any persona to explore details and actions.</p>
              </div>
              <Button variant="gray" size="sm">
                <Icon name="add" size={14} className="opacity-60" />
                Add Persona
              </Button>
            </div>

            {/* Persona cards — DiscoverPage grid style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {personas.map((p) => (
                <PersonaCard
                  key={p.id}
                  p={p}
                  onClick={() => setSelectedPersona(selectedPersona?.id === p.id ? null : p)}
                />
              ))}
            </div>

            {/* Persona detail panel */}
            <AnimatePresence>
              {selectedPersona && (
                <PersonaDetail
                  p={selectedPersona}
                  onClose={() => setSelectedPersona(null)}
                />
              )}
            </AnimatePresence>
          </section>

          {/* ── Channel Fit ───────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-heading">Best Channels to Reach Them</h2>
                <p className="text-xs text-muted mt-0.5">AI ranked by audience fit for your business type.</p>
              </div>
            </div>
            {/* List style from DashboardPage / AccountTab */}
            <DCard padding="none" className="divide-y divide-border/60">
              {channels.map((ch) => (
                <div key={ch.name} className="flex items-center gap-4 p-5">
                  <div className="w-9 h-9 rounded-lg bg-gray flex items-center justify-center shrink-0">
                    <Icon name={ch.icon} size={18} className={cn('shrink-0', ch.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading">{ch.name}</p>
                    <p className="text-xs text-muted mt-0.5">Est. reach: {ch.reach}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end gap-1 w-24">
                      <Progress value={ch.fit} className="w-full h-1.5" />
                      <p className="text-[11px] text-muted">{ch.fit}% fit</p>
                    </div>
                    <Button variant="gray" size="sm">
                      Target
                    </Button>
                  </div>
                </div>
              ))}
            </DCard>
          </section>

          {/* ── Saved Audience Searches ───────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-heading">Saved Audiences</h2>
              <Button variant="ghost" size="sm">
                <Icon name="add" size={14} className="opacity-50" />
                New Search
              </Button>
            </div>
            {/* Compact card grid — inspired by Discover category cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {savedSearches.map((s) => (
                <button
                  key={s.label}
                  className="flex items-center gap-3 p-4 bg-[#FDFEFE] dark:bg-card rounded-[24px] border border-border/60 hover:shadow-sm transition-all duration-200 cursor-pointer text-left w-full">
                  <span className="w-9 h-9 rounded-xl bg-gray flex items-center justify-center shrink-0">
                    <Icon name={s.icon} size={17} className="opacity-50" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-heading leading-snug">{s.label}</p>
                    <p className="text-xs text-muted mt-0.5">{s.count}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── AI Targeting Insight ──────────────────────────────────── */}
          <section>
            <DCard padding="lg" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray flex items-center justify-center shrink-0">
                <Icon name="lamp-on" size={18} className="opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">AI Insight: Your widest opportunity</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Urban professionals aged 25–35 in Bole & CMC represent your highest-fit segment. 
                  Target them on Instagram with morning routine content between 6–9 AM for maximum engagement.
                </p>
              </div>
              <Button variant="dark" size="sm" className="shrink-0">
                <Icon name="status-up" size={14} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                Use This
              </Button>
            </DCard>
          </section>

        </div>
      </motion.div>
    </div>
  );
}
