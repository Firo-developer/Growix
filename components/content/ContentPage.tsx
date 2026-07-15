'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Badge} from '@/components/ui/Badge';
import {Progress} from '@/components/ui/Progress';
import {TabSwitcher} from '@/components/ui/TabSwitcher';
import {AnimatedTabPanel} from '@/components/ui/AnimatedTabPanel';
import {usePageLoading} from '@/hooks/usePageLoading';
import {cn} from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────

type ContentStatus = 'published' | 'draft' | 'scheduled' | 'generating';
type ContentType = 'Blog' | 'Social' | 'Email' | 'Website' | 'Product';

interface ContentItem {
  id: number;
  title: string;
  type: ContentType;
  status: ContentStatus;
  words: number;
  date: string;
  platform?: string;
  platformIcon?: string;
  excerpt: string;
}

const contentLibrary: ContentItem[] = [
  {
    id: 1,
    title: 'The Story of Yirgacheffe: From Farm to Your Cup',
    type: 'Blog',
    status: 'published',
    words: 1240,
    date: 'Apr 5',
    excerpt: 'Every bean at Selam Coffee House tells a story. Follow the journey of our Yirgacheffe single-origin from the hills of southern Ethiopia...',
  },
  {
    id: 2,
    title: 'Morning routine ☀️ — Start your day with intention',
    type: 'Social',
    status: 'scheduled',
    words: 68,
    date: 'Apr 9 · 7:30 AM',
    platform: 'Instagram',
    platformIcon: 'instagram',
    excerpt: 'Your morning sets the tone for everything. Come in for a slow pour-over and a moment of calm before the day begins. ☕',
  },
  {
    id: 3,
    title: 'April Newsletter: New Seasonal Menu + Loyalty Rewards',
    type: 'Email',
    status: 'draft',
    words: 580,
    date: 'Updated 2 days ago',
    excerpt: 'Dear Selam family, April brings a new seasonal menu featuring our limited Guji natural process and the launch of Selam Stars rewards...',
  },
  {
    id: 4,
    title: 'Homepage Hero Copy — "Coffee with a Soul"',
    type: 'Website',
    status: 'published',
    words: 220,
    date: 'Mar 28',
    excerpt: 'We don\'t just serve coffee — we share a 700-year-old Ethiopian tradition. Every cup is a connection to the farmers who made it possible.',
  },
  {
    id: 5,
    title: 'Loyalty rewards launch 🌟 — You earned it!',
    type: 'Social',
    status: 'draft',
    words: 95,
    date: 'Updated today',
    platform: 'Telegram',
    platformIcon: 'direct-right',
    excerpt: 'Introducing Selam Stars — our way of saying thank you to our most loyal coffee lovers. Every visit earns you stars...',
  },
  {
    id: 6,
    title: 'Yirgacheffe Single-Origin — Product Description',
    type: 'Product',
    status: 'published',
    words: 180,
    date: 'Apr 1',
    excerpt: 'Bright, floral, and layered with jasmine and stone fruit notes. Our Yirgacheffe Grade 1 is washed-process and sourced from a women-led cooperative...',
  },
];

const contentTypes: {id: ContentType | 'all'; label: string; icon: string}[] = [
  {id: 'all', label: 'All', icon: 'layer'},
  {id: 'Blog', label: 'Blog', icon: 'document-text'},
  {id: 'Social', label: 'Social', icon: 'instagram'},
  {id: 'Email', label: 'Email', icon: 'email1'},
  {id: 'Website', label: 'Website', icon: 'global'},
  {id: 'Product', label: 'Product', icon: 'medal'},
];

const generateTypes = [
  {id: 'blog', label: 'Blog Post', icon: 'document-text', desc: 'Long-form article or story', est: '800–1,500 words'},
  {id: 'social', label: 'Social Caption', icon: 'instagram', desc: 'Instagram, Telegram, TikTok', est: '50–150 words'},
  {id: 'email', label: 'Email Newsletter', icon: 'email1', desc: 'Monthly update or campaign', est: '300–600 words'},
  {id: 'website', label: 'Website Copy', icon: 'global', desc: 'Hero, about, or landing page', est: '150–400 words'},
  {id: 'product', label: 'Product Description', icon: 'medal', desc: 'Menu item or product listing', est: '100–200 words'},
];

const tones = ['Storytelling', 'Professional', 'Casual & Warm', 'Exciting', 'Educational'];
const lengths = ['Short', 'Medium', 'Long'];

const templates = [
  {
    id: 1,
    emoji: '☕',
    name: 'Coffee Origin Story',
    type: 'Blog' as ContentType,
    desc: 'Tell the story of your beans — from the farm, the farmers, and the harvest to your café.',
    time: '~45 sec',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200/60 dark:border-amber-800/40',
  },
  {
    id: 2,
    emoji: '📸',
    name: 'Instagram Weekly Caption Pack',
    type: 'Social' as ContentType,
    desc: 'Generate 7 ready-to-post captions for a full week of Instagram content.',
    time: '~1 min',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200/60 dark:border-pink-800/40',
  },
  {
    id: 3,
    emoji: '📧',
    name: 'Monthly Customer Newsletter',
    type: 'Email' as ContentType,
    desc: 'Announce new products, share stories, and keep your customers engaged with a monthly email.',
    time: '~1 min',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200/60 dark:border-blue-800/40',
  },
  {
    id: 4,
    emoji: '🌐',
    name: 'Homepage Hero Copy',
    type: 'Website' as ContentType,
    desc: 'A compelling headline, subheading and CTA for your website\'s most important section.',
    time: '~30 sec',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200/60 dark:border-violet-800/40',
  },
  {
    id: 5,
    emoji: '🎁',
    name: 'Seasonal Offer Announcement',
    type: 'Social' as ContentType,
    desc: 'Promote a limited-time deal, holiday special, or new seasonal menu across all channels.',
    time: '~40 sec',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200/60 dark:border-emerald-800/40',
  },
  {
    id: 6,
    emoji: '⭐',
    name: 'Customer Testimonial Feature',
    type: 'Social' as ContentType,
    desc: 'Turn a customer review into a polished social post that builds trust and social proof.',
    time: '~30 sec',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200/60 dark:border-yellow-800/40',
  },
];

const generatedContent = `**The Story of Yirgacheffe: Where Ethiopian Coffee Was Born**

Few places on earth carry as much meaning for coffee lovers as Yirgacheffe. Tucked into the highlands of the Gedeo Zone in southern Ethiopia, at elevations between 1,700 and 2,200 meters, this small region produces what many experts consider the world's most complex and aromatic coffee.

At Selam Coffee House, we don't just source from Yirgacheffe — we have a direct relationship with the Kochere Cooperative, a collective of 1,400 smallholder farmers who have been cultivating coffee the same way for generations.

**What Makes Yirgacheffe Different?**

The secret lies in the soil, the altitude, and the heirloom varieties. Unlike mass-produced coffees, Yirgacheffe beans grow slowly in rich volcanic soil under the shade of native trees. The result is a coffee with unmistakable floral aromatics — think jasmine, bergamot, and stone fruit — with a bright, clean acidity that sets it apart from any other origin.

**From Farm to Your Cup**

Every bag of our Yirgacheffe Grade 1 travels less than 800 kilometers from the washing station to our roaster in Addis Ababa. We visit the cooperative twice a year — once during harvest (October–January) and once to share feedback from our customers directly with the farmers.

When you order a pour-over at Selam Coffee House, you're not just getting a great cup of coffee. You're participating in a direct economic chain that puts more money in the hands of Ethiopian farmers — the people who made Ethiopian coffee famous in the first place.

Come taste the difference. We'll see you in Bole. ☕`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ContentBadge({status}: {status: ContentStatus}) {
  if (status === 'published') return <Badge variant="success">Published</Badge>;
  if (status === 'scheduled') return <Badge variant="purple">Scheduled</Badge>;
  if (status === 'generating') return <Badge variant="info">Generating</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

function TypeBadge({type}: {type: ContentType}) {
  const map: Record<ContentType, string> = {
    Blog: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    Social: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
    Email: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Website: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    Product: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  };
  return (
    <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-md', map[type])}>
      {type}
    </span>
  );
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

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function LibraryTab() {
  const [activeFilter, setActiveFilter] = useState<ContentType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = contentLibrary.filter((item) => {
    const matchesType = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const stats = [
    {label: 'Total Pieces', value: contentLibrary.length, icon: 'document-text'},
    {label: 'Published', value: contentLibrary.filter(c => c.status === 'published').length, icon: 'copy-success'},
    {label: 'Scheduled', value: contentLibrary.filter(c => c.status === 'scheduled').length, icon: 'calendar'},
    {label: 'Drafts', value: contentLibrary.filter(c => c.status === 'draft').length, icon: 'document'},
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <DCard key={s.label} padding="md" className="flex items-center gap-3">
            <Icon name={s.icon} size={17} className="opacity-40 shrink-0" />
            <div>
              <p className="text-xl font-semibold text-heading leading-none">{s.value}</p>
              <p className="text-[11px] text-muted mt-0.5">{s.label}</p>
            </div>
          </DCard>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-card border border-border/60 rounded-lg px-3 py-2">
          <Icon name="search" size={15} className="opacity-40 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="flex-1 text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 border-none focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {contentTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0',
                activeFilter === t.id
                  ? 'bg-btn-dark text-white border-btn-dark dark:bg-heading dark:text-btn-dark'
                  : 'bg-card border-border/60 text-muted hover:text-heading',
              )}>
              <Icon name={t.icon} size={12} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content list */}
      <DCard padding="none" className="divide-y divide-border/60">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="flex flex-col items-center gap-3 py-16 text-center">
              <Icon name="document" size={32} className="opacity-20" />
              <p className="text-sm text-muted">No content found.</p>
            </motion.div>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="flex items-start gap-4 p-5 hover:bg-gray/30 transition-colors duration-200 cursor-pointer">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <TypeBadge type={item.type} />
                    {item.platformIcon && (
                      <Icon name={item.platformIcon} size={12} className="opacity-50" />
                    )}
                    <ContentBadge status={item.status} />
                  </div>
                  <p className="text-sm font-semibold text-heading leading-snug mb-1">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">{item.excerpt}</p>
                  <p className="text-[11px] text-muted mt-2">{item.words} words · {item.date}</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer">
                    <Icon name="edit" size={14} className="opacity-40" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer">
                    <Icon name="copy" size={14} className="opacity-40" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer">
                    <Icon name="export-arrow2" size={14} className="opacity-40" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </DCard>
    </div>
  );
}

function GenerateTab() {
  const [selectedType, setSelectedType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [selectedTone, setSelectedTone] = useState('Storytelling');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setShowResult(false);
    setGenProgress(0);

    const steps = [20, 45, 70, 90, 100];
    steps.forEach((val, i) => {
      setTimeout(() => {
        setGenProgress(val);
        if (val === 100) {
          setTimeout(() => {
            setGenerating(false);
            setShowResult(true);
          }, 400);
        }
      }, i * 500);
    });
  }

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Content type */}
      <section>
        <p className="text-xs font-semibold text-heading mb-3">Content Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {generateTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={cn(
                'flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                selectedType === t.id
                  ? 'border-heading/25 bg-gray/60'
                  : 'bg-card border-border/60 hover:bg-gray/30',
              )}>
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                selectedType === t.id ? 'bg-btn-dark dark:bg-heading' : 'bg-gray',
              )}>
                <Icon
                  name={t.icon}
                  size={16}
                  className={selectedType === t.id ? 'brightness-0 invert dark:brightness-100 dark:invert-0' : 'opacity-50'}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-heading">{t.label}</p>
                <p className="text-[11px] text-muted leading-snug">{t.est}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Content details */}
      <section>
        <p className="text-xs font-semibold text-heading mb-3">Content Details</p>
        <DCard padding="none" className="divide-y divide-border/60">
          <div className="flex items-start gap-4 p-4">
            <Icon name="lamp-on" size={18} className="opacity-40 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted mb-1.5">Topic or Title</p>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The story of Yirgacheffe coffee and why it matters"
                className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="flex items-start gap-4 p-4">
            <Icon name="gps" size={18} className="opacity-40 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted mb-1.5">Target Audience</p>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Coffee lovers aged 25–35 in Addis Ababa who care about origin and quality"
                className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <Icon name="sound" size={18} className="opacity-40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted mb-2">Tone</p>
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
          <div className="flex items-center gap-4 p-4">
            <Icon name="maximize" size={18} className="opacity-40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted mb-2">Length</p>
              <div className="flex gap-2">
                {lengths.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLength(l)}
                    className={cn(
                      'px-4 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer',
                      selectedLength === l
                        ? 'bg-btn-dark text-white border-btn-dark dark:bg-heading dark:text-btn-dark'
                        : 'bg-gray border-transparent text-muted hover:text-heading',
                    )}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DCard>
      </section>

      {/* Generate CTA */}
      <DCard padding="lg" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-heading">Ready to generate?</p>
          <p className="text-xs text-muted mt-0.5">
            AI will write content tailored to your business, audience, and brand voice.
          </p>
        </div>
        <Button variant="dark" size="md" className="shrink-0" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Writing...
            </>
          ) : (
            <>
              <Icon name="ai-send-message" size={15} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
              Generate Content
            </>
          )}
        </Button>
      </DCard>

      {/* Progress */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 6}}
            transition={{duration: 0.25}}>
            <DCard padding="lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-heading">Writing your content...</p>
                <span className="text-xs text-muted">{genProgress}%</span>
              </div>
              <Progress value={genProgress} className="mb-3" />
              <div className="space-y-1.5">
                {[
                  {label: 'Analyzing brand voice & audience', done: genProgress >= 20},
                  {label: 'Researching topic context', done: genProgress >= 45},
                  {label: 'Drafting content structure', done: genProgress >= 70},
                  {label: 'Writing & refining copy', done: genProgress >= 100},
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                      step.done ? 'bg-emerald-500/15' : 'bg-gray',
                    )}>
                      {step.done
                        ? <Icon name="copy-success" size={9} className="text-emerald-500" />
                        : <div className="w-1 h-1 rounded-full bg-muted/40" />
                      }
                    </div>
                    <span className={cn('text-[11px]', step.done ? 'text-heading font-medium' : 'text-muted')}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </DCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated content result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0}}
            transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}>
            <DCard padding="none" className="overflow-hidden">
              {/* Result header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-gray/30">
                <div className="flex items-center gap-2">
                  <Icon name="copy-success" size={14} className="text-emerald-500" />
                  <p className="text-sm font-semibold text-heading">Generated Blog Post</p>
                  <Badge variant="success">Ready</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
                      copied ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted hover:text-heading hover:bg-gray/80',
                    )}>
                    <Icon name={copied ? 'copy-success' : 'copy'} size={13} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-heading hover:bg-gray/80 transition-colors cursor-pointer">
                    <Icon name="refresh-arrow" size={13} />
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Content body */}
              <div className="p-5 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {generatedContent.split('\n\n').map((para, i) => {
                    if (para.startsWith('**') && para.endsWith('**')) {
                      return (
                        <p key={i} className="text-sm font-semibold text-heading mb-3">
                          {para.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    return (
                      <p key={i} className="text-sm text-text leading-relaxed mb-4">
                        {para.replace(/\*\*/g, '')}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Result footer */}
              <div className="px-5 py-3.5 border-t border-border/60 flex items-center gap-3 bg-gray/20">
                <span className="text-[11px] text-muted">1,240 words · ~6 min read</span>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="gray" size="sm">
                    <Icon name="edit" size={13} className="opacity-60" />
                    Edit
                  </Button>
                  <Button variant="dark" size="sm">
                    <Icon name="archive-add" size={13} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                    Save to Library
                  </Button>
                </div>
              </div>
            </DCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TemplatesTab() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Start from a proven template — just fill in your details and the AI does the rest.
      </p>

      {/* Template grid — Discover style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(selected === t.id ? null : t.id)}
            className={cn(
              'flex flex-col items-start gap-3 p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer',
              selected === t.id
                ? cn(t.bg, t.border, 'shadow-sm')
                : 'bg-card border-border/60 hover:shadow-sm hover:bg-gray/20',
            )}>
            <div className="flex items-start justify-between w-full gap-2">
              <span className="text-3xl leading-none">{t.emoji}</span>
              <TypeBadge type={t.type} />
            </div>
            <div>
              <p className="text-sm font-semibold text-heading">{t.name}</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">{t.desc}</p>
            </div>
            <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-border/30">
              <span className="flex items-center gap-1 text-[11px] text-muted">
                <Icon name="clock" size={11} />
                {t.time}
              </span>
              <span className={cn(
                'text-[11px] font-medium transition-colors duration-200',
                selected === t.id ? 'text-heading' : 'text-muted',
              )}>
                {selected === t.id ? '✓ Selected' : 'Use template →'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Use selected template CTA */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 6}}
            transition={{duration: 0.25}}>
            <DCard padding="lg" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl leading-none">
                  {templates.find(t => t.id === selected)?.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {templates.find(t => t.id === selected)?.name}
                  </p>
                  <p className="text-xs text-muted mt-0.5">Template selected — ready to generate.</p>
                </div>
              </div>
              <Button variant="dark" size="md" className="shrink-0">
                <Icon name="ai-send-message" size={15} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                Use This Template
              </Button>
            </DCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function ContentPage() {
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState('library');

  if (isLoading) {
    return (
      <div className="page-container space-y-6">
        <div className="h-9 w-48 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-80 rounded skeleton-shimmer" />
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 rounded-lg skeleton-shimmer" />)}
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

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gray flex items-center justify-center">
                <Icon name="global" size={15} className="opacity-60" />
              </div>
              <p className="text-sm text-muted">AI Content</p>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight">
              Content
            </h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Generate blogs, social captions, emails, and website copy — all tailored to your Ethiopian business and audience.
            </p>
          </div>
          <TabSwitcher
            tabs={[
              {id: 'library', label: 'Library'},
              {id: 'generate', label: 'Generate'},
              {id: 'templates', label: 'Templates'},
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <AnimatedTabPanel activeTab={activeTab}>
          {activeTab === 'library' && <LibraryTab />}
          {activeTab === 'generate' && <GenerateTab />}
          {activeTab === 'templates' && <TemplatesTab />}
        </AnimatedTabPanel>

      </motion.div>
    </div>
  );
}
