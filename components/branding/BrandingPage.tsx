'use client';

import {useState} from 'react';
import {motion} from 'motion/react';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Badge} from '@/components/ui/Badge';
import {TabSwitcher} from '@/components/ui/TabSwitcher';
import {AnimatedTabPanel} from '@/components/ui/AnimatedTabPanel';
import {usePageLoading} from '@/hooks/usePageLoading';
import {cn} from '@/lib/utils';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const brandPalette = [
  {name: 'Primary', hex: '#2B5CE6', tailwind: 'bg-[#2B5CE6]'},
  {name: 'Secondary', hex: '#F59E0B', tailwind: 'bg-[#F59E0B]'},
  {name: 'Accent', hex: '#10B981', tailwind: 'bg-[#10B981]'},
  {name: 'Neutral', hex: '#6B7280', tailwind: 'bg-[#6B7280]'},
  {name: 'Background', hex: '#F8FAFC', tailwind: 'bg-[#F8FAFC]'},
];

const fontPairings = [
  {heading: 'Playfair Display', body: 'Inter', tag: 'Elegant & Modern'},
  {heading: 'Montserrat', body: 'Source Sans Pro', tag: 'Bold & Clean'},
  {heading: 'Merriweather', body: 'Open Sans', tag: 'Classic & Trustworthy'},
];

const brandVoices = [
  {label: 'Friendly', icon: 'sound', active: true},
  {label: 'Professional', icon: 'medal', active: false},
  {label: 'Inspiring', icon: 'lamp-on', active: false},
  {label: 'Community', icon: 'discover', active: false},
];

const generatedAssets = [
  {
    icon: 'ai-homepage' as const,
    name: 'Full Brand Identity Kit',
    description: 'Logo concept, colors, typography & usage guide',
    status: 'completed' as const,
    date: '2 hours ago',
  },
  {
    icon: 'gallery' as const,
    name: 'Social Media Templates',
    description: 'Instagram, Facebook & Telegram post templates',
    status: 'completed' as const,
    date: 'Yesterday',
  },
  {
    icon: 'document-text' as const,
    name: 'Brand Voice Guide',
    description: 'Tone, messaging & communication style guide',
    status: 'in-progress' as const,
    date: 'Generating...',
  },
  {
    icon: 'subtitle' as const,
    name: 'Brand Tagline Variations',
    description: '10 tagline options tailored to your audience',
    status: 'draft' as const,
    date: '3 days ago',
  },
];

const inputs = [
  {
    icon: 'user' as const,
    label: 'Business Name',
    placeholder: 'e.g. Selam Coffee House',
    type: 'text',
  },
  {
    icon: 'discover' as const,
    label: 'Industry & Niche',
    placeholder: 'e.g. Specialty Coffee & Café, Addis Ababa',
    type: 'text',
  },
  {
    icon: 'gps' as const,
    label: 'Target Audience',
    placeholder: 'e.g. Young professionals aged 22–35 in urban Ethiopia',
    type: 'text',
  },
];

const generateSteps = [
  {icon: 'ai-homepage', label: 'Analyzing your profile', done: true},
  {icon: 'lamp-on', label: 'Generating brand identity', done: true},
  {icon: 'gallery-add', label: 'Creating visual concepts', done: false},
  {icon: 'document-text', label: 'Writing brand voice guide', done: false},
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray flex items-center justify-center shrink-0 mt-0.5">
          <Icon name={icon} size={18} className="opacity-60" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-heading">{title}</h2>
          <p className="text-xs text-muted mt-0.5">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({status}: {status: 'completed' | 'in-progress' | 'draft'}) {
  if (status === 'completed') return <Badge variant="success">Completed</Badge>;
  if (status === 'in-progress') return <Badge variant="info">Generating</Badge>;
  return <Badge variant="outline">Draft</Badge>;
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

// ─── Tabs ────────────────────────────────────────────────────────────────────

function GenerateTab() {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Friendly');
  const [selectedFont, setSelectedFont] = useState(0);
  const [description, setDescription] = useState('');

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
    }, 3000);
  }

  return (
    <div className="space-y-6">
      {/* Business Profile Inputs */}
      <section>
        <SectionHeader
          icon="user"
          title="Business Profile"
          description="Tell the AI about your business so it can generate a brand identity tailored to you."
        />
        <DCard padding="none" className="divide-y divide-border/60">
          {inputs.map((input) => (
            <div key={input.label} className="flex items-center gap-4 p-4">
              <Icon name={input.icon} size={20} className="opacity-40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted mb-1">{input.label}</p>
                <input
                  type={input.type}
                  placeholder={input.placeholder}
                  className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 focus:ring-0 border-none"
                />
              </div>
            </div>
          ))}
          <div className="p-4">
            <div className="flex items-start gap-4">
              <Icon name="document-text" size={20} className="opacity-40 shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted mb-1">What makes your business unique?</p>
                <textarea
                  rows={3}
                  placeholder="e.g. We source single-origin Ethiopian coffee beans directly from Yirgacheffe farmers and serve them in a cozy, artisan setting..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 resize-none border-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </DCard>
      </section>

      {/* Brand Style Preferences */}
      <section>
        <SectionHeader
          icon="gallery"
          title="Brand Style Preferences"
          description="Choose visual style cues the AI will use to shape your brand identity."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Brand Voice */}
          <DCard padding="lg">
            <p className="text-xs font-semibold text-heading mb-3">Brand Voice</p>
            <div className="flex flex-wrap gap-2">
              {brandVoices.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setSelectedVoice(v.label)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-200 cursor-pointer',
                    selectedVoice === v.label
                      ? 'bg-btn-dark text-white border-btn-dark dark:bg-heading dark:text-btn-dark'
                      : 'bg-gray border-transparent text-muted hover:text-heading',
                  )}>
                  <Icon name={v.icon} size={13} />
                  {v.label}
                </button>
              ))}
            </div>
          </DCard>

          {/* Color Palette Preview */}
          <DCard padding="lg">
            <p className="text-xs font-semibold text-heading mb-3">AI Suggested Palette</p>
            <div className="flex gap-2 items-center flex-wrap">
              {brandPalette.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-1">
                  <div
                    className={cn('w-8 h-8 rounded-lg border border-border/40 cursor-pointer hover:scale-110 transition-transform', color.tailwind)}
                  />
                  <span className="text-[10px] text-muted">{color.name}</span>
                </div>
              ))}
            </div>
          </DCard>
        </div>
      </section>

      {/* Typography */}
      <section>
        <SectionHeader
          icon="subtitle"
          title="Typography Pairing"
          description="Select a font combination that reflects your brand personality."
        />
        <div className="flex flex-col gap-2">
          {fontPairings.map((pair, i) => (
            <button
              key={i}
              onClick={() => setSelectedFont(i)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-lg border text-left transition-all duration-200 cursor-pointer w-full',
                selectedFont === i
                  ? 'border-heading/30 bg-gray/60'
                  : 'border-border/60 bg-card hover:bg-gray/30',
              )}>
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                  selectedFont === i ? 'border-heading bg-heading' : 'border-border',
                )}>
                {selectedFont === i && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-btn-dark" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">{pair.heading}</p>
                <p className="text-xs text-muted">{pair.body} · Body</p>
              </div>
              <Badge variant="outline">{pair.tag}</Badge>
            </button>
          ))}
        </div>
      </section>

      {/* Generate Button */}
      <DCard padding="lg" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-heading">Ready to generate your brand identity?</p>
          <p className="text-xs text-muted mt-0.5">
            The AI will create a full brand kit including logo concept, colors, typography, voice guide, and taglines.
          </p>
        </div>
        {done ? (
          <div className="flex items-center gap-2">
            <Icon name="copy-success" size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Generated!</span>
          </div>
        ) : (
          <Button
            variant="dark"
            size="md"
            className="shrink-0 gap-2"
            onClick={handleGenerate}
            disabled={generating}>
            {generating ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icon name="ai-send-message" size={16} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                Generate Brand Kit
              </>
            )}
          </Button>
        )}
      </DCard>

      {/* Generation Progress (shown while generating) */}
      {generating && (
        <motion.div
          initial={{opacity: 0, y: 6}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.3}}>
          <DCard padding="lg">
            <p className="text-xs font-semibold text-heading mb-4">Generating your brand identity...</p>
            <div className="space-y-3">
              {generateSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                    i < 2 ? 'bg-emerald-500/10' : 'bg-gray',
                  )}>
                    {i < 2
                      ? <Icon name="copy-success" size={12} className="text-emerald-500" />
                      : <div className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                    }
                  </div>
                  <span className={cn('text-xs', i < 2 ? 'text-heading font-medium' : 'text-muted')}>
                    {step.label}
                  </span>
                  {i === 2 && (
                    <div className="ml-auto w-3.5 h-3.5 rounded-full border-2 border-muted/30 border-t-muted animate-spin" />
                  )}
                </div>
              ))}
            </div>
          </DCard>
        </motion.div>
      )}
    </div>
  );
}

function AssetsTab() {
  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label: 'Total Assets', value: '12', icon: 'layer'},
          {label: 'Completed', value: '8', icon: 'copy-success'},
          {label: 'In Progress', value: '2', icon: 'refresh-arrow'},
          {label: 'Drafts', value: '2', icon: 'document'},
        ].map((stat) => (
          <DCard key={stat.label} padding="md" className="flex items-center gap-3">
            <Icon name={stat.icon} size={18} className="opacity-40 shrink-0" />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-heading leading-none">{stat.value}</p>
              <p className="text-[11px] text-muted mt-0.5 truncate">{stat.label}</p>
            </div>
          </DCard>
        ))}
      </div>

      {/* Asset List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-heading">Generated Assets</h2>
          <Button variant="gray" size="sm">
            <Icon name="add" size={14} className="opacity-60" />
            New Asset
          </Button>
        </div>
        <DCard padding="none" className="divide-y divide-border/60">
          {generatedAssets.map((asset) => (
            <div
              key={asset.name}
              className="flex items-center gap-4 p-5 hover:bg-gray/30 transition-colors duration-200 cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-gray flex items-center justify-center shrink-0">
                <Icon name={asset.icon} size={18} className="opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">{asset.name}</p>
                <p className="text-xs text-muted mt-0.5 truncate">{asset.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-muted hidden sm:inline">{asset.date}</span>
                <StatusBadge status={asset.status} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors duration-200 cursor-pointer">
                    <Icon name="copy" size={14} className="opacity-50" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors duration-200 cursor-pointer">
                    <Icon name="export-arrow2" size={14} className="opacity-50" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </DCard>
      </section>

      {/* Brand Palette Preview */}
      <section>
        <SectionHeader
          icon="gallery"
          title="Brand Color Palette"
          description="Your AI-generated brand colors. Click any swatch to copy the hex code."
        />
        <DCard padding="lg">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {brandPalette.map((color) => (
              <div key={color.name} className="flex flex-col gap-2">
                <div
                  className={cn(
                    'h-16 rounded-lg border border-border/30 cursor-pointer hover:scale-[1.02] transition-transform',
                    color.tailwind,
                  )}
                />
                <div>
                  <p className="text-xs font-medium text-heading">{color.name}</p>
                  <p className="text-[11px] text-muted font-mono">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </DCard>
      </section>

      {/* Typography Preview */}
      <section>
        <SectionHeader
          icon="subtitle"
          title="Typography System"
          description="Your selected font pairing and how it looks in use."
        />
        <DCard padding="lg">
          <div className="space-y-4">
            <div className="pb-4 border-b border-border/60">
              <p className="text-[10px] font-medium text-muted uppercase tracking-wider mb-2">Heading — Playfair Display</p>
              <p className="text-2xl font-bold text-heading" style={{fontFamily: 'serif'}}>
                Selam Coffee House
              </p>
              <p className="text-base text-heading mt-1" style={{fontFamily: 'serif'}}>
                Crafting Moments, One Cup at a Time
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted uppercase tracking-wider mb-2">Body — Inter</p>
              <p className="text-sm text-text leading-relaxed">
                We source single-origin Ethiopian coffee beans directly from Yirgacheffe farmers,
                bringing the rich heritage of Ethiopian coffee culture to your cup every morning.
              </p>
            </div>
          </div>
        </DCard>
      </section>
    </div>
  );
}

function VoiceTab() {
  return (
    <div className="space-y-6">
      {/* Brand Personality */}
      <section>
        <SectionHeader
          icon="lamp-on"
          title="Brand Personality"
          description="The AI-defined personality traits that guide how your brand communicates."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {trait: 'Warm', desc: 'Your brand feels like a conversation with a trusted friend.', icon: 'sound'},
            {trait: 'Authentic', desc: 'Rooted in Ethiopian culture, never pretentious or corporate.', icon: 'medal'},
            {trait: 'Inviting', desc: 'Every touchpoint makes customers feel welcomed and valued.', icon: 'discover'},
          ].map((item) => (
            <DCard key={item.trait} padding="lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={item.icon} size={16} className="opacity-50" />
                <p className="text-sm font-semibold text-heading">{item.trait}</p>
              </div>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </DCard>
          ))}
        </div>
      </section>

      {/* Taglines */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-heading">Tagline Variations</h2>
            <p className="text-xs text-muted mt-0.5">10 AI-generated taglines — pick your favorite or use all for A/B testing.</p>
          </div>
          <Button variant="gray" size="sm">
            <Icon name="refresh-arrow" size={14} className="opacity-60" />
            Regenerate
          </Button>
        </div>
        <DCard padding="none" className="divide-y divide-border/60">
          {[
            'Where Ethiopian heritage meets your morning ritual.',
            'Crafting moments, one cup at a time.',
            'Taste the story of Yirgacheffe in every sip.',
            'Ethiopia\'s finest, brewed for you.',
            'More than coffee — a community in every cup.',
          ].map((tagline, i) => (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray/30 transition-colors duration-200">
              <span className="text-xs font-mono text-muted w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm text-heading flex-1">{tagline}</p>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer">
                  <Icon name="copy" size={13} className="opacity-40" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer">
                  <Icon name="star2" size={13} className="opacity-40" />
                </button>
              </div>
            </div>
          ))}
        </DCard>
      </section>

      {/* Communication Do's & Don'ts */}
      <section>
        <SectionHeader
          icon="information"
          title="Communication Guide"
          description="How your brand should and shouldn't communicate with customers."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DCard padding="lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold text-heading">Do Use</p>
            </div>
            <ul className="space-y-2">
              {[
                'Warm, conversational language',
                'Ethiopian cultural references',
                'Storytelling about your farmers',
                'Community-focused messaging',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text">
                  <Icon name="arrow-right3" size={12} className="opacity-40 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </DCard>
          <DCard padding="lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <p className="text-xs font-semibold text-heading">Avoid</p>
            </div>
            <ul className="space-y-2">
              {[
                'Corporate jargon or buzzwords',
                'Overly formal or stiff tone',
                'Generic coffee shop clichés',
                'Price-focused messaging only',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text">
                  <Icon name="x" size={12} className="opacity-40 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </DCard>
        </div>
      </section>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BrandingPage() {
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState('generate');

  if (isLoading) {
    return (
      <div className="page-container space-y-6">
        <div className="h-9 w-48 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-72 rounded skeleton-shimmer" />
        <div className="h-64 w-full rounded-lg skeleton-shimmer" />
        <div className="h-48 w-full rounded-lg skeleton-shimmer" />
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
                <Icon name="ai-homepage" size={15} className="opacity-60" />
              </div>
              <p className="text-sm text-muted">AI Branding</p>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight">
              Brand Identity
            </h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Generate a complete brand identity tailored to your Ethiopian business — colors, fonts, voice, and taglines.
            </p>
          </div>
          <TabSwitcher
            tabs={[
              {id: 'generate', label: 'Generate'},
              {id: 'assets', label: 'Assets'},
              {id: 'voice', label: 'Brand Voice'},
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <AnimatedTabPanel activeTab={activeTab}>
          {activeTab === 'generate' && <GenerateTab />}
          {activeTab === 'assets' && <AssetsTab />}
          {activeTab === 'voice' && <VoiceTab />}
        </AnimatedTabPanel>
      </motion.div>
    </div>
  );
}
