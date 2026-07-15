'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Badge} from '@/components/ui/Badge';
import {Progress} from '@/components/ui/Progress';
import {AnimatedTabPanel} from '@/components/ui/AnimatedTabPanel';
import {Modal} from '@/components/ui/Modal';
import {usePageLoading} from '@/hooks/usePageLoading';
import {cn} from '@/lib/utils';

// ─── DCard helper ─────────────────────────────────────────────────────────────

function DCard({className, ...props}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn('!rounded-[24px] bg-[#FDFEFE] dark:bg-card', className)}
      {...props}
    />
  );
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

function SectionLabel({children}: {children: React.ReactNode}) {
  return (
    <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3 px-1">
      {children}
    </p>
  );
}

function SettingRow({
  icon,
  label,
  description,
  action,
  danger,
}: {
  icon: string;
  label: string;
  description?: string;
  action: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="w-9 h-9 rounded-xl bg-gray flex items-center justify-center shrink-0">
        <Icon name={icon} size={17} className={cn('opacity-50', danger && 'text-red-500 opacity-80')} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', danger ? 'text-red-500' : 'text-heading')}>{label}</p>
        {description && <p className="text-xs text-muted mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function Toggle({enabled, onToggle}: {enabled: boolean; onToggle: () => void}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative w-10 h-5.5 rounded-full transition-all duration-300 ease-out cursor-pointer focus:outline-none',
        enabled ? 'bg-btn-dark dark:bg-heading' : 'bg-border/60',
      )}
      style={{height: '22px'}}
      aria-pressed={enabled}>
      <span
        className={cn(
          'absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-out',
          enabled ? 'left-[22px]' : 'left-[3px]',
        )}
      />
    </button>
  );
}

function InputField({
  label,
  value,
  placeholder,
  type = 'text',
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/60 last:border-0">
      <div className="w-28 sm:w-36 shrink-0">
        <p className="text-xs font-medium text-muted">{label}</p>
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'flex-1 text-sm text-heading bg-transparent outline-none border-none focus:ring-0 min-w-0',
          disabled ? 'opacity-40 cursor-not-allowed' : 'placeholder:text-muted/50',
        )}
      />
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function ProfileTab() {
  const [name, setName] = useState('Abebe Kebede');
  const [email, setEmail] = useState('abebe@selamcoffee.et');
  const [phone, setPhone] = useState('+251 91 234 5678');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <DCard padding="lg">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              A
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-btn-dark dark:bg-heading flex items-center justify-center shadow cursor-pointer hover:opacity-80 transition-opacity">
              <Icon name="edit" size={11} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-heading">Abebe Kebede</p>
            <p className="text-xs text-muted mt-0.5">abebe@selamcoffee.et</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success">Pro Plan</Badge>
              <Badge variant="outline">Owner</Badge>
            </div>
          </div>
          <Button variant="gray" size="sm" className="shrink-0 hidden sm:flex">
            <Icon name="gallery-add" size={14} className="opacity-60" />
            Change Photo
          </Button>
        </div>
      </DCard>

      {/* Personal Info */}
      <section>
        <SectionLabel>Personal Information</SectionLabel>
        <DCard padding="none">
          <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
          <InputField label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
          <InputField label="Phone" value={phone} onChange={setPhone} placeholder="+251 9X XXX XXXX" />
          <InputField label="Role" value="Owner / Founder" disabled />
        </DCard>
      </section>

      {/* Password */}
      <section>
        <SectionLabel>Security</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          <SettingRow
            icon="shield"
            label="Password"
            description="Last changed 3 months ago."
            action={<Button variant="gray" size="sm">Change Password</Button>}
          />
          <SettingRow
            icon="shield-tick"
            label="Two-Factor Authentication"
            description="Add an extra layer of security with 2FA."
            action={<Button variant="dark" size="sm">
              <Icon name="add" size={13} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
              Enable 2FA
            </Button>}
          />
        </DCard>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="dark" size="md" onClick={handleSave} disabled={saved}>
          {saved ? (
            <>
              <Icon name="copy-success" size={14} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
              Saved!
            </>
          ) : (
            <>
              <Icon name="archive-add" size={14} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function BusinessTab() {
  const [bizName, setBizName] = useState('Selam Coffee House');
  const [bizType, setBizType] = useState('Specialty Coffee Café');
  const [location, setLocation] = useState('Bole, Addis Ababa');
  const [website, setWebsite] = useState('www.selamcoffee.et');
  const [description, setDescription] = useState(
    'We source single-origin Ethiopian coffee beans directly from Yirgacheffe farmers and serve them in a cozy, artisan setting in the heart of Bole.'
  );
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const completeness = 80;

  return (
    <div className="space-y-6">
      {/* Profile completeness */}
      <DCard padding="lg">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-heading">Business Profile</p>
            <p className="text-xs text-muted mt-0.5">A complete profile improves your AI results.</p>
          </div>
          <Badge variant={completeness >= 80 ? 'success' : 'warning'}>{completeness}% complete</Badge>
        </div>
        <Progress value={completeness} className="mb-1" />
        <p className="text-xs text-muted mt-2">1 field remaining — add your business logo to complete your profile.</p>
      </DCard>

      {/* Business details */}
      <section>
        <SectionLabel>Business Details</SectionLabel>
        <DCard padding="none">
          <InputField label="Business Name" value={bizName} onChange={setBizName} placeholder="Your business name" />
          <InputField label="Type / Industry" value={bizType} onChange={setBizType} placeholder="e.g. Coffee Shop" />
          <InputField label="Location" value={location} onChange={setLocation} placeholder="City, District" />
          <InputField label="Website" value={website} onChange={setWebsite} placeholder="www.yourbusiness.et" />
          <div className="flex items-start gap-4 p-4">
            <div className="w-28 sm:w-36 shrink-0 pt-0.5">
              <p className="text-xs font-medium text-muted">Description</p>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what makes your business unique..."
              className="flex-1 text-sm text-heading bg-transparent outline-none border-none focus:ring-0 resize-none placeholder:text-muted/50 min-w-0"
            />
          </div>
        </DCard>
      </section>

      <section>
        <SectionLabel>Business Logo</SectionLabel>
        <DCard padding="lg" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray text-muted">
              {logoPreview ? <img src={logoPreview} alt="Business logo preview" className="h-full w-full object-cover" /> : <Icon name="ai-homepage" size={23} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-heading">Add your business logo</p>
              <p className="mt-1 text-xs leading-5 text-muted">A logo keeps generated visuals and brand suggestions consistent.</p>
            </div>
          </div>
          <label className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-gray px-3 text-sm font-medium text-heading transition-colors hover:bg-border">
            <Icon name="gallery-add" size={14} />
            {logoPreview ? 'Replace logo' : 'Upload logo'}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) setLogoPreview(URL.createObjectURL(file)); event.target.value = ''; }} />
          </label>
        </DCard>
      </section>

      {/* AI Context */}
      <section>
        <SectionLabel>AI Personalization</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          {[
            {icon: 'gps', label: 'Target Market', value: 'Urban professionals 25–35, Addis Ababa'},
            {icon: 'sound', label: 'Brand Voice', value: 'Warm, Authentic, Community-focused'},
            {icon: 'medal', label: 'Business Stage', value: 'Growing · 2–5 years'},
            {icon: 'global', label: 'Language', value: 'English + Amharic'},
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-4 p-4">
              <div className="w-9 h-9 rounded-xl bg-gray flex items-center justify-center shrink-0">
                <Icon name={row.icon} size={16} className="opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted">{row.label}</p>
                <p className="text-sm font-medium text-heading mt-0.5">{row.value}</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer shrink-0">
                <Icon name="edit" size={13} className="opacity-40" />
              </button>
            </div>
          ))}
        </DCard>
      </section>

      <div className="flex justify-end">
        <Button variant="dark" size="md" onClick={handleSave} disabled={saved}>
          {saved ? (
            <>
              <Icon name="copy-success" size={14} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
              Saved!
            </>
          ) : (
            <>
              <Icon name="archive-add" size={14} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    weeklyReport: true,
    aiInsights: true,
    campaignAlerts: true,
    contentReminders: false,
    productUpdates: true,
    marketingTips: false,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({...prev, [key]: !prev[key]}));
  }

  return (
    <div className="space-y-6">
      <section>
        <SectionLabel>Email Notifications</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          {[
            {key: 'weeklyReport' as const, icon: 'status-up', label: 'Weekly Performance Report', desc: 'A summary of your content, campaigns and audience growth every Monday.'},
            {key: 'aiInsights' as const, icon: 'lamp-on', label: 'AI Insights & Recommendations', desc: 'Get notified when the AI identifies new growth opportunities for your business.'},
            {key: 'campaignAlerts' as const, icon: 'microphone', label: 'Campaign Alerts', desc: 'Alerts when a campaign ends, goes live, or needs attention.'},
            {key: 'contentReminders' as const, icon: 'document-text', label: 'Content Publishing Reminders', desc: 'Reminders 30 minutes before a scheduled post is due to go live.'},
          ].map(({key, icon, label, desc}) => (
            <SettingRow
              key={key}
              icon={icon}
              label={label}
              description={desc}
              action={<Toggle enabled={settings[key]} onToggle={() => toggle(key)} />}
            />
          ))}
        </DCard>
      </section>

      <section>
        <SectionLabel>Platform Notifications</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          {[
            {key: 'productUpdates' as const, icon: 'star2', label: 'Product Updates', desc: 'Be the first to know about new Growix features and improvements.'},
            {key: 'marketingTips' as const, icon: 'discover', label: 'Marketing Tips', desc: 'Occasional tips on growing your Ethiopian business with digital marketing.'},
          ].map(({key, icon, label, desc}) => (
            <SettingRow
              key={key}
              icon={icon}
              label={label}
              description={desc}
              action={<Toggle enabled={settings[key]} onToggle={() => toggle(key)} />}
            />
          ))}
        </DCard>
      </section>

      {/* Notification channel */}
      <section>
        <SectionLabel>Delivery Channels</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          {[
            {icon: 'email1', label: 'Email', value: 'abebe@selamcoffee.et', status: 'Verified'},
            {icon: 'direct-right', label: 'Telegram', value: 'Not connected', status: null},
            {icon: 'instagram', label: 'Instagram', value: '@selamcoffeehouse', status: 'Connected'},
          ].map((ch) => (
            <div key={ch.label} className="flex items-center gap-4 p-5">
              <div className="w-9 h-9 rounded-xl bg-gray flex items-center justify-center shrink-0">
                <Icon name={ch.icon} size={17} className="opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">{ch.label}</p>
                <p className="text-xs text-muted mt-0.5">{ch.value}</p>
              </div>
              {ch.status ? (
                <Badge variant={ch.status === 'Connected' || ch.status === 'Verified' ? 'success' : 'outline'}>
                  {ch.status}
                </Badge>
              ) : (
                <Button variant="gray" size="sm">Connect</Button>
              )}
            </div>
          ))}
        </DCard>
      </section>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [language, setLanguage] = useState('en');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const themes = [
    {id: 'light' as const, icon: 'sun', label: 'Light', desc: 'Clean, bright interface'},
    {id: 'dark' as const, icon: 'moon', label: 'Dark', desc: 'Easy on the eyes'},
    {id: 'system' as const, icon: 'setting', label: 'System', desc: 'Follows device setting'},
  ];

  const languages = [
    {id: 'en', label: 'English', flag: '🇺🇸'},
    {id: 'am', label: 'አማርኛ', flag: '🇪🇹'},
  ];

  return (
    <div className="space-y-6">
      {/* Theme */}
      <section>
        <SectionLabel>Color Theme</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                'flex flex-col items-center gap-2.5 p-4 rounded-[24px] border transition-all duration-200 cursor-pointer',
                theme === t.id
                  ? 'border-heading/30 bg-[#FDFEFE] dark:bg-card shadow-sm'
                  : 'border-border/50 bg-[#FDFEFE]/60 dark:bg-card/60 hover:border-border',
              )}>
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                theme === t.id ? 'bg-btn-dark dark:bg-heading' : 'bg-gray',
              )}>
                <Icon
                  name={t.icon}
                  size={18}
                  className={theme === t.id ? 'brightness-0 invert dark:brightness-100 dark:invert-0' : 'opacity-50'}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-heading">{t.label}</p>
                <p className="text-[11px] text-muted mt-0.5">{t.desc}</p>
              </div>
              {theme === t.id && (
                <div className="w-4 h-4 rounded-full bg-btn-dark dark:bg-heading flex items-center justify-center">
                  <Icon name="copy-success" size={9} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section>
        <SectionLabel>Language</SectionLabel>
        <DCard padding="none">
          <div className="grid grid-cols-2 divide-x divide-border/60">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={cn(
                  'flex items-center gap-3 p-4 transition-all duration-200 cursor-pointer',
                  language === lang.id ? 'bg-gray/60' : 'hover:bg-gray/30',
                  lang.id === 'en' ? 'rounded-l-[24px]' : 'rounded-r-[24px]',
                )}>
                <span className="text-2xl leading-none">{lang.flag}</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-heading">{lang.label}</p>
                  {language === lang.id && (
                    <p className="text-[11px] text-muted mt-0.5">Currently selected</p>
                  )}
                </div>
                {language === lang.id && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-btn-dark dark:bg-heading flex items-center justify-center shrink-0">
                    <Icon name="copy-success" size={9} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </DCard>
      </section>

      {/* Density */}
      <section>
        <SectionLabel>Display Density</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          {[
            {id: 'comfortable' as const, icon: 'maximize', label: 'Comfortable', desc: 'More spacing, easier to read'},
            {id: 'compact' as const, icon: 'minimize', label: 'Compact', desc: 'Denser layout, more content visible'},
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDensity(d.id)}
              className="flex items-center gap-4 p-4 w-full text-left hover:bg-gray/30 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gray flex items-center justify-center shrink-0">
                <Icon name={d.icon} size={16} className="opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">{d.label}</p>
                <p className="text-xs text-muted mt-0.5">{d.desc}</p>
              </div>
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                density === d.id ? 'border-heading bg-heading' : 'border-border/60',
              )}>
                {density === d.id && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-btn-dark" />}
              </div>
            </button>
          ))}
        </DCard>
      </section>
    </div>
  );
}

function PlanTab() {
  const [cancelling, setCancelling] = useState(false);

  const features = [
    {icon: 'ai-send-message', label: 'AI Content Generation', value: 'Unlimited'},
    {icon: 'microphone', label: 'Ad Campaigns', value: 'Up to 20 / month'},
    {icon: 'document-text', label: 'Business Plans', value: '5 full plans'},
    {icon: 'gps', label: 'Customer Personas', value: 'Unlimited'},
    {icon: 'status-up', label: 'Analytics Reports', value: 'Weekly + monthly'},
    {icon: 'global', label: 'Languages', value: 'English + Amharic'},
  ];

  const invoices = [
    {date: 'Jul 1, 2025', amount: 'ETB 590', status: 'Paid'},
    {date: 'Jun 1, 2025', amount: 'ETB 590', status: 'Paid'},
    {date: 'May 1, 2025', amount: 'ETB 590', status: 'Paid'},
  ];

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <DCard padding="lg">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-semibold text-heading">Pro Plan</p>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-xs text-muted">Renews on August 1, 2025 · ETB 590 / month</p>
          </div>
          <Button variant="gray" size="sm">Manage Plan</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5 py-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Icon name={f.icon} size={12} className="text-emerald-500" />
              </div>
              <p className="text-xs text-muted flex-1">{f.label}</p>
              <p className="text-xs font-medium text-heading shrink-0">{f.value}</p>
            </div>
          ))}
        </div>
      </DCard>

      {/* Usage */}
      <section>
        <SectionLabel>Usage This Month</SectionLabel>
        <DCard padding="lg">
          <div className="space-y-4">
            {[
              {label: 'Content Generated', used: 18, max: 'Unlimited', pct: 60},
              {label: 'Ad Campaigns', used: 4, max: '20', pct: 20},
              {label: 'AI Assistant Messages', used: 312, max: 'Unlimited', pct: 75},
            ].map((u) => (
              <div key={u.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-heading">{u.label}</p>
                  <p className="text-[11px] text-muted">
                    {u.used} <span className="opacity-60">/ {u.max}</span>
                  </p>
                </div>
                <Progress value={u.pct} className="h-1.5" />
              </div>
            ))}
          </div>
        </DCard>
      </section>

      {/* Invoices */}
      <section>
        <SectionLabel>Billing History</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          {invoices.map((inv) => (
            <div key={inv.date} className="flex items-center gap-4 p-4">
              <div className="w-9 h-9 rounded-xl bg-gray flex items-center justify-center shrink-0">
                <Icon name="document-text" size={16} className="opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-heading">{inv.date}</p>
                <p className="text-xs text-muted mt-0.5">{inv.amount} · Monthly subscription</p>
              </div>
              <Badge variant="success">{inv.status}</Badge>
              <button className="p-1.5 rounded-lg hover:bg-gray/80 transition-colors cursor-pointer">
                <Icon name="export-arrow2" size={13} className="opacity-40" />
              </button>
            </div>
          ))}
        </DCard>
      </section>

      {/* Upgrade CTA */}
      <DCard padding="lg" className="border-dashed flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
          <Icon name="star2" size={18} className="brightness-0 invert" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-heading">Upgrade to Enterprise</p>
          <p className="text-xs text-muted mt-0.5">
            Unlimited everything, custom AI training, priority support, and a dedicated account manager.
          </p>
        </div>
        <Button variant="dark" size="sm" className="shrink-0">
          <Icon name="star2" size={13} className="brightness-0 invert dark:brightness-100 dark:invert-0" />
          View Enterprise
        </Button>
      </DCard>
    </div>
  );
}

function AdvancedTab() {
  const [exportRequested, setExportRequested] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);

  const canDelete = deleteInput === 'DELETE';

  return (
    <div className="space-y-6">
      <section>
        <SectionLabel>AI Company Context</SectionLabel>
        <DCard padding="lg" className="border-[#c9ded4] bg-[#edf4f0] dark:border-[#2c4a3d] dark:bg-[#17261f]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card text-[#28745d] dark:bg-card dark:text-[#76c9a6]"><Icon name="ai-send-message" size={19} /></span>
              <div><p className="text-base font-semibold text-heading">Company information for Growix</p><p className="mt-1 max-w-xl text-sm leading-6 text-text">Your company profile, customers, goals, brand voice, and channels give every AI recommendation the right context.</p></div>
            </div>
            <Button variant="dark" size="sm" className="shrink-0" onClick={() => setContextOpen(true)}><Icon name="document-text" size={14} />Review context</Button>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-border/60 bg-card/75 px-4 py-3"><div><p className="text-sm font-semibold text-heading">Use this context in AI work</p><p className="mt-0.5 text-xs text-muted">Applies to plans, content, targeting, and recommendations.</p></div><Toggle enabled={contextEnabled} onToggle={() => setContextEnabled((current) => !current)} /></div>
        </DCard>
      </section>

      {/* Data Export */}
      <section>
        <SectionLabel>Data & Privacy</SectionLabel>
        <DCard padding="none" className="divide-y divide-border/60">
          <SettingRow
            icon="export-arrow2"
            label="Export My Data"
            description="Download a full export of your content, campaigns, personas, and business plans as a ZIP file."
            action={
              <Button variant="gray" size="sm" onClick={() => setExportRequested(true)} disabled={exportRequested}>
                {exportRequested ? (
                  <>
                    <Icon name="copy-success" size={13} className="opacity-60" />
                    Requested
                  </>
                ) : (
                  'Export Data'
                )}
              </Button>
            }
          />
          <SettingRow
            icon="document-text"
            label="Privacy Policy"
            description="Read how Growix collects and uses your data."
            action={
              <Button variant="ghost" size="sm">
                <Icon name="arrow-right3" size={13} className="opacity-50" />
                View
              </Button>
            }
          />
          <SettingRow
            icon="shield"
            label="Terms of Service"
            description="Review your agreement with Growix."
            action={
              <Button variant="ghost" size="sm">
                <Icon name="arrow-right3" size={13} className="opacity-50" />
                View
              </Button>
            }
          />
        </DCard>
      </section>

      {/* Danger zone */}
      <section>
        <SectionLabel>Danger Zone</SectionLabel>
        <DCard padding="none" className="border border-red-200/60 dark:border-red-900/40 divide-y divide-border/60">
          <SettingRow
            icon="refresh-arrow"
            label="Reset AI Context"
            description="Clear all AI-learned context and preferences. Your content and campaigns are not deleted."
            danger
            action={<Button variant="gray" size="sm">Reset Context</Button>}
          />
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="x" size={16} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-500">Delete Account</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  Permanently delete your Growix account and all associated data. This action cannot be undone.
                </p>

                <AnimatePresence>
                  {!deleteConfirm ? (
                    <motion.div
                      key="btn"
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}>
                      <Button
                        variant="gray"
                        size="sm"
                        className="mt-3 text-red-500 border-red-200/60 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => setDeleteConfirm(true)}>
                        Delete My Account
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="confirm"
                      initial={{opacity: 0, y: 4}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: 4}}
                      className="mt-4 space-y-3">
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40">
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          ⚠️ Type <span className="font-mono font-bold">DELETE</span> to confirm account deletion.
                        </p>
                      </div>
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="w-full text-sm text-heading bg-transparent border border-border/60 rounded-xl px-3 py-2 outline-none focus:ring-0 focus:border-red-300 dark:focus:border-red-800 placeholder:text-muted/50"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="gray"
                          size="sm"
                          onClick={() => {setDeleteConfirm(false); setDeleteInput('');}}>
                          Cancel
                        </Button>
                        <button
                          disabled={!canDelete}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                            canDelete
                              ? 'bg-red-500 text-white cursor-pointer hover:bg-red-600'
                              : 'bg-red-100 dark:bg-red-950/40 text-red-300 dark:text-red-700 cursor-not-allowed',
                          )}>
                          <Icon name="x" size={12} />
                          Permanently Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </DCard>
      </section>
      <Modal open={contextOpen} onOpenChange={setContextOpen} title="AI company context" description="This is the company information Growix uses to make its guidance specific to your business." icon={<Icon name="ai-send-message" size={18} className="text-heading" />} hideFooter className="max-w-[980px] max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-border/60 bg-gray/45 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-[#28745d]"><Icon name="ai-homepage" size={20} /></span><p className="mt-5 text-base font-semibold text-heading">Selam Coffee House</p><p className="mt-1 text-sm text-muted">Specialty coffee cafe in Bole, Addis Ababa</p><div className="mt-6 space-y-3 border-t border-border/60 pt-5"><div><p className="text-xs text-muted">Context status</p><p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active for AI work</p></div><div><p className="text-xs text-muted">Profile completeness</p><p className="mt-1 text-sm font-semibold text-heading">80% complete</p></div><div><p className="text-xs text-muted">Used in</p><p className="mt-1 text-sm leading-6 text-heading">Plans, campaigns, content, targeting, and recommendations</p></div></div></aside>
          <div className="space-y-4"><div className="rounded-2xl border border-[#c9ded4] bg-[#edf4f0] p-4 dark:border-[#2c4a3d] dark:bg-[#17261f]"><p className="text-sm font-semibold text-heading">How the AI uses this</p><p className="mt-1 text-sm leading-6 text-text">The assistant uses your audience, goals, offer, tone, and operating context to avoid generic answers and suggest work that fits this company.</p></div><div className="grid gap-3 sm:grid-cols-2">{[{icon: 'ai-homepage', title: 'Business profile', items: ['Selam Coffee House', 'Specialty Coffee Cafe', 'Bole, Addis Ababa', '2-5 years in business']}, {icon: 'archive-add', title: 'Products and services', items: ['Single-origin coffee and pastries', 'Catering and delivery', 'Direct farmer sourcing']}, {icon: 'gps', title: 'Target customers', items: ['Urban professionals, age 25-35', 'Addis Ababa and online', 'Mid-market, quality-focused']}, {icon: 'status-up', title: 'Business direction', items: ['Grow repeat customers', 'Improve brand awareness', 'Expand online presence']}, {icon: 'sound', title: 'Brand identity', items: ['Warm and authentic voice', 'Community-focused personality', 'English and Amharic']}, {icon: 'global', title: 'Marketing context', items: ['Instagram, Facebook, Telegram', 'ETB 5,000-15,000 monthly budget', 'Loyalty campaign in progress']}].map((group) => <section key={group.title} className="rounded-2xl border border-border/60 bg-card p-4"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray text-muted"><Icon name={group.icon} size={15} /></span><h3 className="text-sm font-semibold text-heading">{group.title}</h3></div><ul className="mt-4 space-y-2">{group.items.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-text"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#4e9b7a]" />{item}</li>)}</ul></section>)}</div></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {id: 'profile', label: 'Profile'},
    {id: 'business', label: 'Business'},
    {id: 'notifications', label: 'Notifications'},
    {id: 'appearance', label: 'Appearance'},
    {id: 'plan', label: 'Plan & Billing'},
    {id: 'danger', label: 'Advanced'},
  ];

  if (isLoading) {
    return (
      <div className="page-container space-y-6">
        <div className="h-9 w-36 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-64 rounded skeleton-shimmer" />
        <div className="h-12 w-full rounded-xl skeleton-shimmer" />
        <div className="h-48 w-full rounded-[24px] skeleton-shimmer" />
        <div className="h-64 w-full rounded-[24px] skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{opacity: 0, y: 8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}>

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gray flex items-center justify-center">
                <Icon name="setting" size={15} className="opacity-60" />
              </div>
              <p className="text-sm text-muted">Account</p>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-heading tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-muted mt-1 max-w-md">
              Manage your profile, business details, AI preferences, and account options.
            </p>
          </div>
        </div>

        {/* ── Tab Switcher ─────────────────────────────────────────────── */}
        <div className="mb-7 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 bg-tab-bg rounded-xl p-1 w-fit min-w-full sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer',
                  activeTab === tab.id
                    ? 'text-heading'
                    : 'text-muted hover:text-heading',
                )}>
                {activeTab === tab.id && <motion.span layoutId="settings-active-tab" className="absolute inset-0 rounded-lg bg-tab-active shadow-sm" transition={{type: 'spring', stiffness: 420, damping: 32}} />}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────── */}
        <AnimatedTabPanel activeTab={activeTab}>
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'business' && <BusinessTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'plan' && <PlanTab />}
          {activeTab === 'danger' && <AdvancedTab />}
        </AnimatedTabPanel>

      </motion.div>
    </div>
  );
}
