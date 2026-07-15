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

const planSections = [
  {
    id: 'executive',
    icon: 'document-text',
    title: 'Executive Summary',
    desc: 'One-page overview of the entire business plan.',
    status: 'done' as const,
    words: 420,
  },
  {
    id: 'market',
    icon: 'discover',
    title: 'Market Analysis',
    desc: 'Target market, competitors, and industry trends.',
    status: 'done' as const,
    words: 780,
  },
  {
    id: 'product',
    icon: 'medal',
    title: 'Product & Services',
    desc: 'What you sell, pricing, and unique value proposition.',
    status: 'done' as const,
    words: 540,
  },
  {
    id: 'marketing',
    icon: 'status-up',
    title: 'Marketing Strategy',
    desc: 'How you attract and retain customers.',
    status: 'in-progress' as const,
    words: 210,
  },
  {
    id: 'operations',
    icon: 'layer',
    title: 'Operations Plan',
    desc: 'Day-to-day operations, suppliers, and location.',
    status: 'in-progress' as const,
    words: 95,
  },
  {
    id: 'financial',
    icon: 'simcard',
    title: 'Financial Projections',
    desc: '12-month revenue, expenses, and break-even analysis.',
    status: 'pending' as const,
    words: 0,
  },
  {
    id: 'risk',
    icon: 'information',
    title: 'Risk Assessment',
    desc: 'Potential risks and mitigation strategies.',
    status: 'pending' as const,
    words: 0,
  },
];

const generatedSectionContent: Record<string, {headline: string; body: string}> = {
  executive: {
    headline: 'Selam Coffee House — Executive Summary',
    body: 'Selam Coffee House is a specialty café based in Bole, Addis Ababa, dedicated to bringing Ethiopia\'s world-renowned coffee culture to urban professionals and creatives. Founded in 2024, we source single-origin beans directly from Yirgacheffe and Sidama farmers, offering a premium artisan experience at accessible prices. Our target market is urban Ethiopians aged 22–38 who value quality, community, and authenticity. We project ETB 1.8M in revenue in Year 1, growing to ETB 4.2M by Year 3, driven by foot traffic, a loyalty program, and an expanding catering service.',
  },
  market: {
    headline: 'Market Analysis',
    body: 'Addis Ababa\'s café market is rapidly expanding, with an estimated 12% year-on-year growth in specialty coffee consumption. Our primary competition includes chains like Kaldi\'s Coffee and Tomoca, who focus on volume over experience. Our differentiation — farm traceability, artisan preparation, and a community-first environment — targets a growing segment of quality-conscious consumers currently underserved by mass-market chains. Market research indicates ~42,000 urban professionals in Bole and CMC districts who visit cafés at least twice per week.',
  },
  product: {
    headline: 'Products & Services',
    body: 'Core offerings include single-origin pour-over coffee (ETB 80–140), espresso-based drinks (ETB 60–110), and a rotating seasonal menu tied to Ethiopian harvest cycles. We also offer whole-bean retail bags (ETB 350–700), corporate catering packages, and private coffee tasting events. Our planned loyalty program — Selam Stars — rewards frequent visitors with free drinks and exclusive access to new roast launches. Each offering is designed to deepen the customer relationship beyond a transactional visit.',
  },
  marketing: {
    headline: 'Marketing Strategy',
    body: 'Our go-to-market strategy centers on three pillars: community storytelling, influencer partnerships, and hyperlocal targeting. We will invest ETB 8,000/month across Instagram, Telegram, and TikTok — prioritizing authentic farm-to-cup content, morning routine reels, and user-generated posts. In the first 90 days, we will run a "First Cup Free" acquisition campaign targeting new followers, supported by micro-influencer partnerships with 5 Addis-based lifestyle creators with 5K–50K followers.',
  },
  operations: {
    headline: 'Operations Plan',
    body: 'Our flagship location at Bole Medhanealem will operate from 6:30 AM to 9:00 PM daily. Staff will include 2 trained baristas, 1 cashier, and 1 manager per shift. Bean sourcing is handled through direct contracts with 3 cooperatives in Yirgacheffe, with bi-weekly delivery. Equipment: La Marzocco Linea espresso machine, Mahlkönig grinders, and Hario V60 pour-over sets. Point-of-sale managed via Loyverse POS with Chapa payment integration for mobile payments.',
  },
};

const financialRows = [
  {label: 'Month 1 Revenue', value: 'ETB 92,000', trend: '+0%', icon: 'arrow-up'},
  {label: 'Month 3 Revenue', value: 'ETB 148,000', trend: '+61%', icon: 'arrow-up'},
  {label: 'Month 6 Revenue', value: 'ETB 210,000', trend: '+42%', icon: 'arrow-up'},
  {label: 'Month 12 Revenue', value: 'ETB 310,000', trend: '+48%', icon: 'arrow-up'},
  {label: 'Break-even Point', value: 'Month 4', trend: '', icon: 'discover'},
  {label: 'Year 1 Projection', value: 'ETB 1.84M', trend: '', icon: 'medal'},
];

const exportOptions = [
  {id: 'pdf', label: 'Export as PDF', icon: 'document-text', desc: 'Professional formatted document', badge: 'Popular'},
  {id: 'word', label: 'Export as Word', icon: 'document', desc: 'Editable .docx file', badge: null},
  {id: 'clipboard', label: 'Copy to Clipboard', icon: 'copy', desc: 'Paste into Google Docs or Notion', badge: null},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionStatus({status}: {status: 'done' | 'in-progress' | 'pending'}) {
  if (status === 'done') return <Badge variant="success">Done</Badge>;
  if (status === 'in-progress') return <Badge variant="info">In Progress</Badge>;
  return <Badge variant="outline">Pending</Badge>;
}

function SectionStatusIcon({status}: {status: 'done' | 'in-progress' | 'pending'}) {
  if (status === 'done')
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
        <Icon name="copy-success" size={11} className="text-emerald-500" />
      </div>
    );
  if (status === 'in-progress')
    return (
      <div className="w-5 h-5 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      </div>
    );
  return (
    <div className="w-5 h-5 rounded-full border-2 border-border/60 shrink-0" />
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

function OverviewTab({onSectionClick}: {onSectionClick: (id: string) => void}) {
  const done = planSections.filter((s) => s.status === 'done').length;
  const total = planSections.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-8">

      {/* Plan completeness */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DCard padding="lg" className="sm:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-muted mb-0.5">Plan Completeness</p>
                <p className="text-3xl font-semibold text-heading leading-none">{pct}%</p>
              </div>
              <Badge variant={pct === 100 ? 'success' : 'info'}>
                {done}/{total} sections
              </Badge>
            </div>
            <Progress value={pct} className="mb-2" />
            <p className="text-xs text-muted">
              {total - done} sections remaining — complete them to unlock a full export.
            </p>
          </DCard>

          <div className="flex flex-col gap-3">
            <DCard padding="md" className="flex items-center gap-3">
              <Icon name="document-text" size={18} className="opacity-40 shrink-0" />
              <div>
                <p className="text-base font-semibold text-heading leading-none">
                  {planSections.reduce((a, s) => a + s.words, 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-muted mt-0.5">words written</p>
              </div>
            </DCard>
            <DCard padding="md" className="flex items-center gap-3">
              <Icon name="clock" size={18} className="opacity-40 shrink-0" />
              <div>
                <p className="text-base font-semibold text-heading leading-none">~12 min</p>
                <p className="text-[11px] text-muted mt-0.5">read time</p>
              </div>
            </DCard>
          </div>
        </div>
      </section>

      {/* Sections list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-heading">Plan Sections</h2>
            <p className="text-xs text-muted mt-0.5">Click any section to view or edit its content.</p>
          </div>
          <Button variant="gray" size="sm">
            <Icon name="refresh-arrow" size={14} className="opacity-60" />
            Regenerate All
          </Button>
        </div>
        <DCard padding="none" className="divide-y divide-border/60">
          {planSections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className="flex items-center gap-4 p-5 hover:bg-gray/30 transition-colors duration-200 cursor-pointer w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-gray flex items-center justify-center shrink-0">
                <Icon name={section.icon} size={17} className="opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">{section.title}</p>
                <p className="text-xs text-muted mt-0.5">{section.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {section.words > 0 && (
                  <span className="text-[11px] text-muted hidden sm:inline">{section.words} words</span>
                )}
                <SectionStatusIcon status={section.status} />
                <SectionStatus status={section.status} />
              </div>
            </button>
          ))}
        </DCard>
      </section>

      {/* Financial snapshot */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-heading">Financial Snapshot</h2>
            <p className="text-xs text-muted mt-0.5">AI-projected revenue milestones for Year 1.</p>
          </div>
          <Badge variant="warning">Projected</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {financialRows.map((row) => (
            <DCard key={row.label} padding="md" className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon name={row.icon} size={13} className="opacity-40 shrink-0" />
                <p className="text-[11px] text-muted truncate">{row.label}</p>
              </div>
              <p className="text-base font-semibold text-heading">{row.value}</p>
              {row.trend && (
                <p className="text-[11px] text-emerald-500 font-medium">{row.trend}</p>
              )}
            </DCard>
          ))}
        </div>
      </section>
    </div>
  );
}

function GenerateTab() {
  const [expandedSection, setExpandedSection] = useState<string | null>('executive');
  const [generating, setGenerating] = useState(false);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('Selam Coffee House');
  const [businessType, setBusinessType] = useState('Specialty Coffee Café');
  const [location, setLocation] = useState('Bole, Addis Ababa');
  const [goals, setGoals] = useState('');

  function handleGenerateAll() {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  }

  function handleGenerateSection(id: string) {
    setGeneratingSection(id);
    setTimeout(() => { setGeneratingSection(null); setExpandedSection(id); }, 1800);
  }

  const completedSections = planSections.filter((s) => s.status === 'done' || s.status === 'in-progress');

  return (
    <div className="space-y-6">
      {/* Business info form */}
      <section>
        <p className="text-xs font-semibold text-heading mb-3">Business Information</p>
        <DCard padding="none" className="divide-y divide-border/60">
          {[
            {icon: 'user', label: 'Business Name', value: businessName, setter: setBusinessName, placeholder: 'e.g. Selam Coffee House'},
            {icon: 'discover', label: 'Business Type & Industry', value: businessType, setter: setBusinessType, placeholder: 'e.g. Specialty Coffee Café'},
            {icon: 'location', label: 'Location', value: location, setter: setLocation, placeholder: 'e.g. Bole, Addis Ababa'},
          ].map((field) => (
            <div key={field.label} className="flex items-center gap-4 p-4">
              <Icon name={field.icon} size={18} className="opacity-40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted mb-1">{field.label}</p>
                <input
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 border-none focus:ring-0"
                />
              </div>
            </div>
          ))}
          <div className="flex items-start gap-4 p-4">
            <Icon name="lamp-on" size={18} className="opacity-40 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted mb-1">Business Goals & Vision</p>
              <textarea
                rows={3}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Become the #1 specialty coffee destination in Addis Ababa by 2027, with 3 locations and a subscription delivery service..."
                className="w-full text-sm text-heading bg-transparent outline-none placeholder:text-muted/60 resize-none border-none focus:ring-0"
              />
            </div>
          </div>
        </DCard>
      </section>

      {/* Generate all button */}
      <DCard padding="lg" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-heading">Generate Complete Business Plan</p>
          <p className="text-xs text-muted mt-0.5">
            AI writes all 7 sections at once — executive summary, market analysis, financials, operations, and more.
          </p>
        </div>
        <Button variant="dark" size="md" className="shrink-0" onClick={handleGenerateAll} disabled={generating}>
          {generating ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Writing Plan...
            </>
          ) : (
            <>
              <Icon name="ai-send-message" size={15} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
              Generate All Sections
            </>
          )}
        </Button>
      </DCard>

      {/* Section-by-section accordion */}
      <section>
        <p className="text-xs font-semibold text-heading mb-3">Generated Sections</p>
        <div className="flex flex-col gap-2">
          {completedSections.map((section) => {
            const content = generatedSectionContent[section.id];
            const isOpen = expandedSection === section.id;
            const isGenerating = generatingSection === section.id;

            return (
              <DCard key={section.id} padding="none" className="overflow-hidden">
                {/* Accordion header */}
                <button
                  onClick={() => setExpandedSection(isOpen ? null : section.id)}
                  className="flex items-center gap-4 p-4 w-full text-left hover:bg-gray/30 transition-colors duration-200 cursor-pointer">
                  <SectionStatusIcon status={section.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading">{section.title}</p>
                    {!isOpen && content && (
                      <p className="text-xs text-muted mt-0.5 truncate">{content.body.slice(0, 80)}...</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-muted hidden sm:inline">{section.words} words</span>
                    <Icon
                      name="arrow-down"
                      size={14}
                      className={cn('opacity-40 transition-transform duration-200', isOpen && 'rotate-180')}
                    />
                  </div>
                </button>

                {/* Accordion body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: 'auto', opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}>
                      <div className="border-t border-border/60 p-4">
                        {content ? (
                          <>
                            <p className="text-sm font-semibold text-heading mb-2">{content.headline}</p>
                            <p className="text-sm text-text leading-relaxed">{content.body}</p>
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
                              <button className="flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors cursor-pointer">
                                <Icon name="edit" size={13} />Edit
                              </button>
                              <button className="flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors cursor-pointer">
                                <Icon name="copy" size={13} />Copy
                              </button>
                              <button
                                onClick={() => handleGenerateSection(section.id)}
                                className="flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors cursor-pointer">
                                <Icon name="refresh-arrow" size={13} />Regenerate
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-start gap-3">
                            <p className="text-sm text-muted">This section hasn't been generated yet.</p>
                            <Button
                              variant="gray"
                              size="sm"
                              onClick={() => handleGenerateSection(section.id)}
                              disabled={isGenerating}>
                              {isGenerating ? (
                                <>
                                  <div className="w-3 h-3 rounded-full border-2 border-muted/30 border-t-muted animate-spin" />
                                  Writing...
                                </>
                              ) : (
                                <>
                                  <Icon name="ai-send-message" size={13} className="opacity-60" />
                                  Generate Section
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ExportTab() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  function handleExport(id: string) {
    setExporting(id);
    setDone(null);
    setTimeout(() => { setExporting(null); setDone(id); }, 2000);
  }

  const done3 = planSections.filter((s) => s.status === 'done').length;
  const total = planSections.length;
  const pct = Math.round((done3 / total) * 100);

  return (
    <div className="space-y-8">
      {/* Readiness */}
      <DCard padding="lg">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-heading">Plan Export Readiness</p>
            <p className="text-xs text-muted mt-0.5">Complete all sections for the best export quality.</p>
          </div>
          <Badge variant={pct >= 80 ? 'success' : 'warning'}>
            {pct}% complete
          </Badge>
        </div>
        <Progress value={pct} className="mb-3" />
        <div className="flex flex-wrap gap-2">
          {planSections.map((s) => (
            <div
              key={s.id}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border',
                s.status === 'done'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : s.status === 'in-progress'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  : 'bg-gray text-muted border-border/60',
              )}>
              <div className={cn(
                'w-1.5 h-1.5 rounded-full',
                s.status === 'done' ? 'bg-emerald-500' : s.status === 'in-progress' ? 'bg-blue-500' : 'bg-muted/40',
              )} />
              {s.title}
            </div>
          ))}
        </div>
      </DCard>

      {/* Export options */}
      <section>
        <h2 className="text-base font-semibold text-heading mb-4">Export Options</h2>
        <div className="flex flex-col gap-3">
          {exportOptions.map((opt) => (
            <DCard key={opt.id} padding="none" className="overflow-hidden">
              <div className="flex items-center gap-4 p-5">
                <div className="w-10 h-10 rounded-xl bg-gray flex items-center justify-center shrink-0">
                  <Icon name={opt.icon} size={20} className="opacity-50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-heading">{opt.label}</p>
                    {opt.badge && <Badge variant="info">{opt.badge}</Badge>}
                  </div>
                  <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                </div>
                <Button
                  variant="dark"
                  size="sm"
                  className="shrink-0"
                  onClick={() => handleExport(opt.id)}
                  disabled={exporting === opt.id}>
                  {exporting === opt.id ? (
                    <>
                      <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Exporting...
                    </>
                  ) : done === opt.id ? (
                    <>
                      <Icon name="copy-success" size={13} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                      Done!
                    </>
                  ) : (
                    <>
                      <Icon name="export-arrow2" size={13} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                      Export
                    </>
                  )}
                </Button>
              </div>
            </DCard>
          ))}
        </div>
      </section>

      {/* Plan preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-heading">Plan Preview</h2>
          <Badge variant="outline">Read-only</Badge>
        </div>
        <DCard padding="none" className="divide-y divide-border/60">
          {/* Cover page row */}
          <div className="p-6 bg-gray/20 text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-btn-dark dark:bg-heading flex items-center justify-center mb-1">
              <Icon name="star2" size={18} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
            </div>
            <p className="text-base font-semibold text-heading">Selam Coffee House</p>
            <p className="text-xs text-muted">Business Plan · 2025</p>
            <p className="text-[11px] text-muted">Bole, Addis Ababa · Specialty Coffee Café</p>
          </div>
          {planSections
            .filter((s) => s.status === 'done')
            .map((section, i) => {
              const content = generatedSectionContent[section.id];
              return (
                <div key={section.id} className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono text-muted w-5">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-sm font-semibold text-heading">{section.title}</p>
                  </div>
                  {content && (
                    <p className="text-xs text-text leading-relaxed line-clamp-3 ml-7">
                      {content.body}
                    </p>
                  )}
                </div>
              );
            })}
        </DCard>
      </section>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function BusinessPlanPage() {
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState('overview');

  function handleSectionClick(id: string) {
    setActiveTab('generate');
  }

  if (isLoading) {
    return (
      <div className="page-container space-y-6">
        <div className="h-9 w-52 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-80 rounded skeleton-shimmer" />
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2].map((i) => <div key={i} className="h-28 rounded-lg skeleton-shimmer" />)}
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

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gray flex items-center justify-center">
                <Icon name="subtitle" size={15} className="opacity-60" />
              </div>
              <p className="text-sm text-muted">AI Business Plan</p>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight">
              Business Plan
            </h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Generate a professional, investor-ready business plan tailored to your Ethiopian business — section by section.
            </p>
          </div>
          <TabSwitcher
            tabs={[
              {id: 'overview', label: 'Overview'},
              {id: 'generate', label: 'Generate'},
              {id: 'export', label: 'Export'},
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <AnimatedTabPanel activeTab={activeTab}>
          {activeTab === 'overview' && <OverviewTab onSectionClick={handleSectionClick} />}
          {activeTab === 'generate' && <GenerateTab />}
          {activeTab === 'export' && <ExportTab />}
        </AnimatedTabPanel>

      </motion.div>
    </div>
  );
}
