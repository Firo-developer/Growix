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

// ─── Data ─────────────────────────────────────────────────────────────────────

const platforms = [
  {id: 'instagram', label: 'Instagram', icon: 'instagram', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-pink-200/60 dark:border-pink-800/40'},
  {id: 'telegram', label: 'Telegram', icon: 'direct-right', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200/60 dark:border-blue-800/40'},
  {id: 'facebook', label: 'Facebook', icon: 'global', color: 'text-blue-600', bg: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-sky-200/60 dark:border-sky-800/40'},
  {id: 'tiktok', label: 'TikTok', icon: 'microphone', color: 'text-heading', bg: 'bg-gray dark:bg-gray', border: 'border-border/60'},
];

const adGoals = [
  {id: 'awareness', label: 'Brand Awareness', icon: 'discover', desc: 'Grow recognition'},
  {id: 'leads', label: 'Lead Generation', icon: 'user', desc: 'Capture contacts'},
  {id: 'sales', label: 'Drive Sales', icon: 'status-up', desc: 'Convert buyers'},
  {id: 'traffic', label: 'Website Traffic', icon: 'global', desc: 'Send visitors'},
];

const adFormats = [
  {id: 'story', label: 'Story / Reel', icon: 'gallery', size: '9:16'},
  {id: 'feed', label: 'Feed Post', icon: 'gallery-add', size: '1:1'},
  {id: 'caption', label: 'Ad Caption', icon: 'document-text', size: 'Text'},
  {id: 'carousel', label: 'Carousel', icon: 'layer', size: 'Multi'},
];

const tones = ['Exciting', 'Professional', 'Friendly', 'Urgent', 'Inspiring'];

const generatedAds = [
  {
    id: 1,
    platform: 'Instagram',
    platformIcon: 'instagram',
    platformColor: 'text-pink-500',
    format: 'Feed Post',
    headline: '☕ Start Your Morning Right',
    body: 'Discover Addis Ababa\'s finest specialty coffee — sourced directly from Yirgacheffe farmers. Visit us in Bole and taste the difference. ✨\n\n#SelameCoffe #AddisAbaba #EthiopianCoffee',
    cta: 'Visit Us Today',
    score: 91,
    status: 'ready' as const,
  },
  {
    id: 2,
    platform: 'Telegram',
    platformIcon: 'direct-right',
    platformColor: 'text-blue-500',
    format: 'Ad Caption',
    headline: '🌱 Direct from Yirgacheffe to Your Cup',
    body: 'No middlemen. No compromise. Just pure Ethiopian coffee culture in the heart of Addis. Come see us — first cup is on us this week. 🇪🇹',
    cta: 'Claim Free Cup',
    score: 85,
    status: 'ready' as const,
  },
  {
    id: 3,
    platform: 'Instagram',
    platformIcon: 'instagram',
    platformColor: 'text-pink-500',
    format: 'Story',
    headline: '⚡ Limited Time Offer',
    body: 'Buy 2 specialty coffees, get 1 FREE this weekend only. Tag a friend you\'d bring! ☕🎉',
    cta: 'Swipe Up',
    score: 78,
    status: 'ready' as const,
  },
];

const savedCampaigns = [
  {
    icon: 'instagram' as const,
    name: 'Ramadan Campaign 2025',
    meta: 'Instagram · 4 ads · Created 3 days ago',
    status: 'active' as const,
    reach: '8.4K',
  },
  {
    icon: 'direct-right' as const,
    name: 'Morning Coffee Launch',
    meta: 'Telegram · 2 ads · Created last week',
    status: 'draft' as const,
    reach: '—',
  },
  {
    icon: 'global' as const,
    name: 'Grand Opening Ads',
    meta: 'Facebook · 6 ads · Created 2 weeks ago',
    status: 'completed' as const,
    reach: '14.2K',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CampaignStatus({status}: {status: 'active' | 'draft' | 'completed'}) {
  if (status === 'active') return <Badge variant="success">Active</Badge>;
  if (status === 'draft') return <Badge variant="outline">Draft</Badge>;
  return <Badge variant="info">Completed</Badge>;
}

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

function AdPreviewCard({ad, index}: {ad: typeof generatedAds[0]; index: number}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3, delay: index * 0.08, ease: [0.22, 1, 0.36, 1]}}>
      <DCard padding="none" className="flex flex-col h-full overflow-hidden">
        {/* Ad Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-gray/30">
          <div className="flex items-center gap-2">
            <Icon name={ad.platformIcon} size={15} className={cn('shrink-0', ad.platformColor)} />
            <span className="text-xs font-medium text-heading">{ad.platform}</span>
            <span className="text-[11px] text-muted">·</span>
            <span className="text-[11px] text-muted">{ad.format}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-muted">{ad.score}% score</span>
            </div>
          </div>
        </div>

        {/* Ad Body */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          <p className="text-sm font-semibold text-heading leading-snug">{ad.headline}</p>
          <p className="text-xs text-text leading-relaxed whitespace-pre-line flex-1">{ad.body}</p>

          {/* CTA pill */}
          <div className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full bg-btn-dark text-white text-[11px] font-medium">
            <Icon name="arrow-right3" size={11} className="brightness-0 invert" />
            {ad.cta}
          </div>
        </div>

        {/* Ad Footer */}
        <div className="px-4 py-3 border-t border-border/60 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer',
              copied ? 'text-emerald-500' : 'text-muted hover:text-heading',
            )}>
            <Icon name={copied ? 'copy-success' : 'copy'} size={13} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors duration-200 cursor-pointer">
            <Icon name="edit" size={13} />
            Edit
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors duration-200 cursor-pointer">
            <Icon name="export-arrow2" size={13} />
            Export
          </button>
          <button className="ml-auto flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors duration-200 cursor-pointer">
            <Icon name="refresh-arrow" size={13} />
            Regenerate
          </button>
        </div>
      </DCard>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AdsPage() {
  const isLoading = usePageLoading();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [selectedGoal, setSelectedGoal] = useState('awareness');
  const [selectedFormat, setSelectedFormat] = useState('feed');
  const [selectedTone, setSelectedTone] = useState('Exciting');
  const [adCount, setAdCount] = useState(3);
  const [description, setDescription] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function handleGenerate() {
    setGenerating(true);
    setShowResults(false);
    setTimeout(() => {
      setGenerating(false);
      setShowResults(true);
    }, 2800);
  }

  if (isLoading) {
    return (
      <div className="page-container space-y-6">
        <div className="h-9 w-64 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-80 rounded skeleton-shimmer" />
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl skeleton-shimmer" />)}
        </div>
        <div className="h-52 rounded-lg skeleton-shimmer" />
        <div className="h-40 rounded-lg skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{opacity: 0, y: 8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gray flex items-center justify-center">
                <Icon name="microphone" size={15} className="opacity-60" />
              </div>
              <p className="text-sm text-muted">AI Advertising</p>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight">
              Ad Generator
            </h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Create scroll-stopping ads for Instagram, Telegram, Facebook and TikTok — tailored to your Ethiopian audience.
            </p>
          </div>
          <Button
            variant="dark"
            size="md"
            className="shrink-0 self-start sm:self-auto"
            onClick={handleGenerate}
            disabled={generating}>
            {generating ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Generating Ads...
              </>
            ) : (
              <>
                <Icon name="ai-send-message" size={15} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                Generate Ads
              </>
            )}
          </Button>
        </div>

        <div className="space-y-8">

          {/* ── Step 1: Platforms ────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-btn-dark dark:bg-heading text-white dark:text-btn-dark text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
              <h2 className="text-sm font-semibold text-heading">Choose Platforms</h2>
              <span className="text-xs text-muted">Select one or more</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {platforms.map((p) => {
                const active = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                      active ? cn(p.bg, p.border) : 'bg-[#FDFEFE] dark:bg-card border-border/60 hover:bg-gray/40',
                    )}>
                    <span className={cn('w-9 h-9 rounded-xl bg-white/70 dark:bg-black/20 flex items-center justify-center shrink-0')}>
                      <Icon name={p.icon} size={18} className={active ? p.color : 'opacity-40'} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-heading">{p.label}</p>
                      {active && <p className="text-[11px] text-muted mt-0.5">Selected</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Step 2: Goal + Format ────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-btn-dark dark:bg-heading text-white dark:text-btn-dark text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
              <h2 className="text-sm font-semibold text-heading">Ad Goal & Format</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Goal */}
              <DCard padding="lg">
                <p className="text-xs font-semibold text-heading mb-3">Campaign Goal</p>
                <div className="flex flex-col gap-1.5">
                  {adGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={cn(
                        'flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200 cursor-pointer text-left',
                        selectedGoal === goal.id
                          ? 'border-heading/25 bg-gray/60'
                          : 'border-transparent hover:bg-gray/40',
                      )}>
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                        selectedGoal === goal.id ? 'bg-btn-dark dark:bg-heading' : 'bg-gray',
                      )}>
                        <Icon
                          name={goal.icon}
                          size={14}
                          className={selectedGoal === goal.id ? 'brightness-0 invert dark:brightness-100 dark:invert-0' : 'opacity-50'}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-heading">{goal.label}</p>
                        <p className="text-[11px] text-muted">{goal.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </DCard>

              {/* Format + Count */}
              <div className="flex flex-col gap-4">
                <DCard padding="lg">
                  <p className="text-xs font-semibold text-heading mb-3">Ad Format</p>
                  <div className="grid grid-cols-2 gap-2">
                    {adFormats.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFormat(f.id)}
                        className={cn(
                          'flex flex-col items-start gap-1 p-3 rounded-lg border transition-all duration-200 cursor-pointer',
                          selectedFormat === f.id
                            ? 'border-heading/25 bg-gray/60'
                            : 'border-border/60 hover:bg-gray/40',
                        )}>
                        <Icon name={f.icon} size={16} className="opacity-50" />
                        <p className="text-xs font-semibold text-heading">{f.label}</p>
                        <p className="text-[11px] text-muted">{f.size}</p>
                      </button>
                    ))}
                  </div>
                </DCard>

                <DCard padding="lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-heading">Number of Ads</p>
                    <span className="text-xs text-muted">Max 6</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdCount((n) => Math.max(1, n - 1))}
                      className="w-8 h-8 rounded-lg bg-gray flex items-center justify-center hover:bg-border/60 transition-colors cursor-pointer text-heading font-medium text-sm">
                      −
                    </button>
                    <span className="text-base font-semibold text-heading w-6 text-center">{adCount}</span>
                    <button
                      onClick={() => setAdCount((n) => Math.min(6, n + 1))}
                      className="w-8 h-8 rounded-lg bg-gray flex items-center justify-center hover:bg-border/60 transition-colors cursor-pointer text-heading font-medium text-sm">
                      +
                    </button>
                  </div>
                </DCard>
              </div>
            </div>
          </section>

          {/* ── Step 3: Ad Details ───────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-btn-dark dark:bg-heading text-white dark:text-btn-dark text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
              <h2 className="text-sm font-semibold text-heading">Ad Details</h2>
            </div>
            <DCard padding="none" className="divide-y divide-border/60">
              {/* Description */}
              <div className="flex items-start gap-4 p-4">
                <Icon name="note" size={18} className="opacity-40 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted mb-1.5">What are you advertising?</p>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Our new seasonal Yirgacheffe single-origin espresso, available for a limited time at our Bole location..."
                    className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 resize-none border-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Key message */}
              <div className="flex items-start gap-4 p-4">
                <Icon name="lamp-on" size={18} className="opacity-40 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted mb-1.5">Key message or offer</p>
                  <input
                    type="text"
                    value={keyMessage}
                    onChange={(e) => setKeyMessage(e.target.value)}
                    placeholder="e.g. First cup free this weekend, or 20% off for new customers"
                    className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 border-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Tone */}
              <div className="flex items-center gap-4 p-4">
                <Icon name="sound" size={18} className="opacity-40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted mb-2">Ad Tone</p>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTone(t)}
                        className={cn(
                          'px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer',
                          selectedTone === t
                            ? 'bg-btn-dark text-white border-btn-dark dark:bg-heading dark:text-btn-dark'
                            : 'bg-gray border-transparent text-muted hover:text-heading',
                        )}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DCard>
          </section>

          {/* ── Generating progress ──────────────────────────────────── */}
          <AnimatePresence>
            {generating && (
              <motion.div
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 6}}
                transition={{duration: 0.25}}>
                <DCard padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-muted/30 border-t-muted animate-spin" />
                    <p className="text-sm font-semibold text-heading">Writing your ads...</p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      {label: 'Analyzing your business profile', pct: 100},
                      {label: 'Applying audience targeting', pct: 100},
                      {label: 'Crafting ad copy variations', pct: 65},
                      {label: 'Optimizing for each platform', pct: 20},
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <p className="text-xs text-muted w-52 shrink-0 truncate">{step.label}</p>
                        <Progress value={step.pct} className="flex-1 h-1.5" />
                      </div>
                    ))}
                  </div>
                </DCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Generated Ads ────────────────────────────────────────── */}
          <AnimatePresence>
            {showResults && (
              <motion.section
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.3}}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-heading">Generated Ads</h2>
                    <p className="text-xs text-muted mt-0.5">{generatedAds.length} ads ready — copy, edit, or export each one.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="gray" size="sm">
                      <Icon name="export-arrow2" size={14} className="opacity-60" />
                      Export All
                    </Button>
                    <Button variant="gray" size="sm" onClick={handleGenerate}>
                      <Icon name="refresh-arrow" size={14} className="opacity-60" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {generatedAds.map((ad, i) => (
                    <AdPreviewCard key={ad.id} ad={ad} index={i} />
                  ))}
                </div>

                {/* Save prompt */}
                <DCard padding="lg" className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon name="task" size={18} className="opacity-40 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-heading">Save as a Campaign</p>
                      <p className="text-xs text-muted mt-0.5">Group these ads into a campaign to track performance and export together.</p>
                    </div>
                  </div>
                  <Button variant="dark" size="sm" className="shrink-0">
                    <Icon name="archive-add" size={14} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                    Save Campaign
                  </Button>
                </DCard>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Saved Campaigns ──────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-heading">Saved Campaigns</h2>
              <Button variant="text" size="sm">View all</Button>
            </div>
            <DCard padding="none" className="divide-y divide-border/60">
              {savedCampaigns.map((campaign) => (
                <div
                  key={campaign.name}
                  className="flex items-center gap-4 p-5 hover:bg-gray/30 transition-colors duration-200 cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-gray flex items-center justify-center shrink-0">
                    <Icon name={campaign.icon} size={17} className="opacity-50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading">{campaign.name}</p>
                    <p className="text-xs text-muted mt-0.5 truncate">{campaign.meta}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {campaign.reach !== '—' && (
                      <div className="hidden sm:flex flex-col items-end">
                        <p className="text-sm font-semibold text-heading">{campaign.reach}</p>
                        <p className="text-[11px] text-muted">reach</p>
                      </div>
                    )}
                    <CampaignStatus status={campaign.status} />
                    <Button variant="gray" size="sm">Open</Button>
                  </div>
                </div>
              ))}
            </DCard>
          </section>

        </div>
      </motion.div>
    </div>
  );
}
