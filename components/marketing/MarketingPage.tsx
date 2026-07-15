'use client';

import {useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {AnimatedMarkdown, StreamingMarkdownLine} from '@/components/assistant/AnimatedMarkdown';
import {Button} from '@/components/ui/Button';
import {Card} from '@/components/ui/Card';
import {DatePicker} from '@/components/ui/DatePicker';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/DropdownMenu';
import {Icon} from '@/components/ui/Icon';
import {Input} from '@/components/ui/Input';
import {Select} from '@/components/ui/Select';
import {cn} from '@/lib/utils';

const PROMPT_FONT_SIZE = 18;
const PROMPT_LINE_HEIGHT = 28;
const RESPONSE_STREAM_FONT_SIZE = 16;
const RESPONSE_STREAM_LINE_HEIGHT = 26;

type CampaignPlan = {
  id: number;
  title: string;
  goal: string;
  channels: string[];
  createdAt: string;
  content: string;
};

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

const BRIEF_DELIMITER = '---UPDATED_BRIEF---';

function extractPlanTitle(content: string, fallback: string) {
  return content.match(/^#{1,2}\s+(.+)$/m)?.[1] || fallback;
}

function parseAssistantEditResponse(full: string) {
  const markerIndex = full.indexOf(BRIEF_DELIMITER);
  if (markerIndex === -1) {
    return {reply: full.trim(), brief: null};
  }

  return {
    reply: full.slice(0, markerIndex).trim(),
    brief: full.slice(markerIndex + BRIEF_DELIMITER.length).trim() || null,
  };
}

async function streamAssistantResponse(
  messages: Array<{role: 'user' | 'assistant'; content: string}>,
  onChunk?: (content: string) => void,
) {
  const response = await fetch('/api/assistant', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({messages}),
  });

  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => ({error: 'The AI service is unavailable.'}));
    throw new Error(typeof payload.error === 'string' ? payload.error : 'The AI service is unavailable.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, {stream: true}).replace(/\r\n/g, '\n');
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const data = event.split('\n').filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
      if (!data || data === '[DONE]') continue;
      const payload = JSON.parse(data) as {choices?: Array<{delta?: {content?: string}}>};
      const next = payload.choices?.[0]?.delta?.content;
      if (next) {
        content += next;
        onChunk?.(content);
      }
    }
  }

  if (!content.trim()) throw new Error('The AI did not return a response.');
  return content;
}

const businessContext = {
  name: 'Selam Coffee House',
  industry: 'Coffee and hospitality',
  audience: 'Students, young professionals, and returning local customers',
  location: 'Addis Ababa, Ethiopia',
};

const objectives = [
  {value: 'increase-sales', label: 'Increase sales'},
  {value: 'get-customers', label: 'Get more customers'},
  {value: 'brand-awareness', label: 'Improve brand awareness'},
  {value: 'launch-offer', label: 'Launch an offer'},
  {value: 'customer-loyalty', label: 'Build customer loyalty'},
];

const channelOptions = [
  {id: 'Instagram', icon: 'instagram'},
  {id: 'Facebook', icon: 'global'},
  {id: 'TikTok', icon: 'microphone'},
  {id: 'Telegram', icon: 'direct-right'},
];

function SheetChatUserMessage({text}: {text: string}) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = text.length > 280;

  return (
    <motion.div initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}} className="ml-auto w-fit max-w-[88%]">
      <div className={cn('bg-gray text-heading', canCollapse ? 'rounded-[20px] px-3.5 py-2.5' : 'rounded-full px-3.5 py-2')}>
        <p className={cn('whitespace-pre-wrap text-[14px] leading-6', canCollapse && !expanded && 'max-h-[180px] overflow-hidden')}>
          {text}
        </p>
        {canCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-heading transition-opacity hover:opacity-70">
            {expanded ? 'Show less' : 'Show more'}
            <Icon name={expanded ? 'arrow-up' : 'arrow-down'} size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function SheetChatAssistantMessage({text}: {text: string}) {
  return (
    <motion.article initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.25}} className="max-w-full">
      <AnimatedMarkdown content={text} animate={false} />
    </motion.article>
  );
}

function SheetChatStreamingReply({content}: {content: string}) {
  const lines = content.split('\n');

  return (
    <motion.article initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.25}} className="max-w-full" aria-live="polite">
      <div className="space-y-1">
        {lines.map((line, index) => (
          <div key={`stream-line-${index}`} style={{fontSize: `${RESPONSE_STREAM_FONT_SIZE}px`, lineHeight: `${RESPONSE_STREAM_LINE_HEIGHT}px`}}>
            <StreamingMarkdownLine content={line} animate={false} />
          </div>
        ))}
      </div>
      <span className="ml-1 inline-block h-4 w-0.5 animate-pulse rounded-full bg-heading align-[-3px]" aria-hidden="true" />
    </motion.article>
  );
}

function PlanChatPanel({
  open,
  planTitle,
  content,
  onClose,
  onContentUpdate,
  onExpandedChange,
}: {
  open: boolean;
  planTitle: string;
  content: string;
  onClose: () => void;
  onContentUpdate: (content: string, title?: string) => void;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingReply, setStreamingReply] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasConversation = expanded || messages.length > 0 || isGenerating;

  useEffect(() => {
    onExpandedChange?.(hasConversation);
  }, [hasConversation, onExpandedChange]);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setInput('');
      setMessages([]);
      setStreamingReply('');
      setError('');
      setIsTextExpanded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [open]);

  useEffect(() => {
    if (hasConversation) {
      messagesEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
    }
  }, [messages, streamingReply, hasConversation, isGenerating]);

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const contentHeight = Math.min(textarea.scrollHeight, 160);
    textarea.style.height = `${Math.max(contentHeight, PROMPT_LINE_HEIGHT)}px`;
    setIsTextExpanded(contentHeight > PROMPT_LINE_HEIGHT + 8);
  }

  useEffect(() => {
    resizeTextarea();
  }, [input, open]);

  async function sendMessage() {
    const prompt = input.trim();
    if (!prompt || isGenerating) return;

    setError('');
    setExpanded(true);
    setInput('');
    const userMessage: ChatMessage = {id: Date.now(), role: 'user', text: prompt};
    setMessages((current) => [...current, userMessage]);
    setIsGenerating(true);
    setStreamingReply('');

    const history = messages.map((message) => ({role: message.role, content: message.text}));
    const enrichedPrompt = `${prompt}\n\nCurrent campaign brief to explain or edit:\n${content}\n\nRespond in two parts separated by exactly "${BRIEF_DELIMITER}":\n1. A concise, friendly reply explaining what you changed or answering the question.\n2. The complete updated campaign brief in Markdown. Always include the full brief, even for small edits or pure explanations.`;

    try {
      const fullResponse = await streamAssistantResponse(
        [
          ...history,
          {role: 'user', content: enrichedPrompt},
        ],
        (streamed) => {
          const markerIndex = streamed.indexOf(BRIEF_DELIMITER);
          setStreamingReply((markerIndex === -1 ? streamed : streamed.slice(0, markerIndex)).trim());
        },
      );

      const {reply, brief} = parseAssistantEditResponse(fullResponse);
      const assistantText = reply || 'I updated your campaign brief based on your request.';
      setMessages((current) => [...current, {id: Date.now() + 1, role: 'assistant', text: assistantText}]);

      if (brief) {
        onContentUpdate(brief, extractPlanTitle(brief, planTitle));
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Could not reach the AI assistant.';
      setError(message);
      setMessages((current) => [...current, {id: Date.now() + 1, role: 'assistant', text: `I could not complete that request. ${message}`}]);
    } finally {
      setIsGenerating(false);
      setStreamingReply('');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && !isGenerating) void sendMessage();
    }
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  const canSend = Boolean(input.trim());

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          layout
          initial={{y: 24, opacity: 0, scale: 0.98}}
          animate={{y: 0, opacity: 1, scale: 1}}
          exit={{y: 24, opacity: 0, scale: 0.98}}
          transition={{type: 'spring', stiffness: 380, damping: 34}}
          className={cn(
            'absolute inset-x-3 bottom-3 z-20 flex flex-col overflow-hidden sm:inset-x-4 sm:bottom-4',
            'rounded-[24px] border border-white/50 bg-card/85 shadow-[0_12px_40px_rgba(25,27,31,0.14)] backdrop-blur-2xl dark:border-white/10',
            hasConversation ? 'max-h-[min(520px,58vh)]' : '',
          )}>
          <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3.5 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/90 text-heading shadow-sm">
                <Icon name="conversation-box" size={14} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-heading">Refine with AI</p>
                <p className="truncate text-[11px] text-muted">
                  {hasConversation ? 'Your brief updates as you chat' : 'Explain, fix, or expand this brief'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray/80 hover:text-heading"
              aria-label="Close chat">
              <Icon name="arrow-down" size={15} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {hasConversation && (
              <motion.div
                initial={{opacity: 0, height: 0}}
                animate={{opacity: 1, height: 'auto'}}
                exit={{opacity: 0, height: 0}}
                transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}
                className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3 [scrollbar-color:theme(colors.border)_transparent] [scrollbar-width:thin]">
                {messages.length === 0 && !isGenerating && (
                  <p className="mb-3 rounded-2xl border border-border/60 bg-gray/40 px-3 py-2.5 text-xs leading-5 text-muted">
                    Ask the AI to explain a section, rewrite copy, adjust the schedule, or make the brief more detailed.
                  </p>
                )}
                <div className="space-y-4">
                  {messages.map((message) => (
                    message.role === 'user'
                      ? <SheetChatUserMessage key={message.id} text={message.text} />
                      : <SheetChatAssistantMessage key={message.id} text={message.text} />
                  ))}
                  {isGenerating && !streamingReply && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex h-7 items-center" aria-label="Assistant is thinking">
                      <motion.span
                        className="h-2.5 w-2.5 rounded-full bg-heading"
                        animate={{opacity: [0.35, 1, 0.35], scale: [0.82, 1, 0.82]}}
                        transition={{duration: 0.95, repeat: Infinity, ease: 'easeInOut'}}
                      />
                    </motion.div>
                  )}
                  {isGenerating && streamingReply && (
                    <SheetChatStreamingReply content={streamingReply} />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="shrink-0 border-t border-border/50 p-2.5">
            {error && (
              <p className="mb-2 rounded-xl bg-[#fff0f0] px-3 py-2 text-xs text-[#c23434] dark:bg-[#3a1518] dark:text-[#ff9d9d]">
                {error}
              </p>
            )}
            <motion.div
              layout
              transition={{type: 'spring', stiffness: 380, damping: 32}}
              className="rounded-[22px] border border-border/70 bg-card/90 p-2 shadow-[0_8px_24px_rgba(18,18,18,0.04)] transition-shadow focus-within:shadow-[0_8px_28px_rgba(18,18,18,0.07)]">
              <div className={cn('grid gap-2', isTextExpanded ? 'grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto]' : 'grid-cols-[minmax(0,1fr)_auto] items-center')}>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={handleChange}
                  onInput={resizeTextarea}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI to explain or improve this brief..."
                  style={{fontSize: `${PROMPT_FONT_SIZE}px`, lineHeight: `${PROMPT_LINE_HEIGHT}px`}}
                  className={cn(
                    'block min-w-0 resize-none bg-transparent font-normal text-heading outline-none placeholder:text-muted',
                    isTextExpanded
                      ? 'col-span-2 col-start-1 row-start-1 max-h-[140px] overflow-y-auto px-2 pt-1'
                      : 'col-start-1 row-start-1 min-h-[28px] overflow-hidden py-0 pl-2',
                  )}
                  aria-label="Ask AI to refine the campaign brief"
                />
                <div className={cn('flex shrink-0 items-center justify-end', isTextExpanded ? 'col-start-2 row-start-2' : 'col-start-2 row-start-1')}>
                  {isGenerating ? (
                    <button
                      type="button"
                      disabled
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-heading/70 text-bg"
                      aria-label="Generating response">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-bg/40 border-t-bg" />
                    </button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={!canSend}
                      initial={false}
                      animate={{scale: canSend ? 1 : 0.88, opacity: canSend ? 1 : 0.7}}
                      transition={{type: 'spring', stiffness: 420, damping: 25}}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-heading text-bg transition-opacity enabled:hover:opacity-90 disabled:bg-[#A8A8AA]"
                      aria-label="Send message">
                      <Icon name="arrow-up" size={18} className="text-bg" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlanSheet({
  plan,
  open,
  onClose,
  onPlanUpdate,
}: {
  plan: CampaignPlan | null;
  open: boolean;
  onClose: () => void;
  onPlanUpdate: (id: number, updates: Partial<Pick<CampaignPlan, 'title' | 'content'>>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [content, setContent] = useState(plan?.content ?? '');
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setChatOpen(false);
      setChatExpanded(false);
    }
  }, [open]);

  useEffect(() => {
    if (plan) setContent(plan.content);
  }, [plan]);

  if (!plan) return null;

  const copyPlan = () => void navigator.clipboard.writeText(content);
  const downloadPlan = (format: 'markdown' | 'text') => {
    const isMarkdown = format === 'markdown';
    const exportContent = isMarkdown ? content : content.replace(/[#*_`>]/g, '');
    const blob = new Blob([exportContent], {type: isMarkdown ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${plan.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'campaign-plan'}.${isMarkdown ? 'md' : 'txt'}`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  function handleContentUpdate(nextContent: string, nextTitle?: string) {
    if (!plan) return;
    setContent(nextContent);
    setContentVersion((current) => current + 1);
    onPlanUpdate(plan.id, {
      content: nextContent,
      ...(nextTitle ? {title: nextTitle} : {}),
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-heading/20 backdrop-blur-[2px]"
            aria-label="Close campaign plan"
          />
          <motion.aside
            initial={{opacity: 0, x: 48, scale: 0.98}}
            animate={{opacity: 1, x: 0, scale: 1}}
            exit={{opacity: 0, x: 48, scale: 0.98}}
            transition={{type: 'spring', stiffness: 360, damping: 34}}
            className={cn(
              'fixed z-[160] flex flex-col overflow-hidden border border-white/50 bg-card/80 shadow-[-16px_14px_50px_rgba(25,27,31,0.16)] backdrop-blur-2xl transition-[top,right,bottom,left,width,border-radius] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10',
              expanded
                ? 'inset-0 rounded-none sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[min(960px,calc(100vw-5rem))] lg:w-[min(1100px,calc(100vw-8rem))]'
                : 'bottom-2 right-2 top-2 w-[calc(100vw-1rem)] rounded-[24px] sm:bottom-4 sm:right-4 sm:top-4 sm:w-[min(640px,calc(100vw-2rem))]',
            )}>
            <div className="p-2.5 sm:p-3">
              <div className="flex items-center justify-between gap-2 rounded-[18px] border border-border/70 bg-card/75 p-1.5 shadow-[0_8px_22px_rgba(25,27,31,0.05)] backdrop-blur-xl">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-heading shadow-sm"><Icon name="document-text" size={16} /></span>
                  <div className="min-w-0 pr-1">
                    <p className="truncate text-sm font-semibold text-heading">{plan.title}</p>
                    <p className="mt-0.5 text-xs text-muted">AI campaign brief</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center rounded-[14px] border border-border/70 bg-card/80 p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setChatOpen((current) => !current)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors hover:bg-gray hover:text-heading',
                      chatOpen ? 'bg-gray text-heading' : 'text-muted',
                    )}
                    aria-label={chatOpen ? 'Close AI chat' : 'Open AI chat'}>
                    <Icon name="conversation-box" size={15} />
                  </button>
                  <button type="button" onClick={() => setExpanded((current) => !current)} className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-gray hover:text-heading" aria-label={expanded ? 'Reduce sheet' : 'Expand sheet'}>
                    <Icon name={expanded ? 'maximize_1' : 'maximize'} size={15} />
                  </button>
                  <button type="button" onClick={copyPlan} className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Copy campaign plan">
                    <Icon name="copy" size={15} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Download campaign plan">
                        <Icon name="arrow-down3" size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className="z-[250] min-w-[170px] bg-card/95 backdrop-blur-xl">
                      <DropdownMenuItem onSelect={() => downloadPlan('markdown')}><Icon name="document-text" size={15} />Markdown (.md)</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => downloadPlan('text')}><Icon name="copy" size={15} />Plain text (.txt)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Close plan">
                    <Icon name="arrow-right3" size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={cn(
                'min-h-0 flex-1 overflow-y-auto px-5 pt-3 transition-[padding-bottom] duration-300 sm:px-8',
                chatOpen ? (chatExpanded ? 'pb-[min(540px,60vh)]' : 'pb-36') : 'pb-7',
              )}>
              <motion.div
                layout
                transition={{type: 'spring', stiffness: 360, damping: 34}}
                className={cn(
                  'mx-auto w-full transition-[max-width,padding] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  expanded ? 'max-w-full sm:max-w-4xl sm:px-4 lg:max-w-5xl lg:px-8' : 'max-w-[560px]',
                )}>
                <div className="mb-7 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-gray px-2.5 py-1 text-xs font-medium text-heading">{plan.goal}</span>
                  {plan.channels.map((channel) => <span key={channel} className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted">{channel}</span>)}
                </div>
                <AnimatedMarkdown key={contentVersion} content={content} animate={false} />
              </motion.div>
            </div>
            <PlanChatPanel
              open={chatOpen}
              planTitle={plan.title}
              content={content}
              onClose={() => setChatOpen(false)}
              onContentUpdate={handleContentUpdate}
              onExpandedChange={setChatExpanded}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function MarketingPage() {
  const [objective, setObjective] = useState('increase-sales');
  const [offer, setOffer] = useState('');
  const [channels, setChannels] = useState<string[]>(['Instagram', 'Telegram']);
  const [startDate, setStartDate] = useState('');
  const [publishTime, setPublishTime] = useState('09:00');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedBrief, setStreamedBrief] = useState('');
  const [plans, setPlans] = useState<CampaignPlan[]>([]);
  const [activePlan, setActivePlan] = useState<CampaignPlan | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [error, setError] = useState('');

  const selectedObjective = objectives.find((item) => item.value === objective)?.label ?? 'Increase sales';

  function toggleChannel(channel: string) {
    setChannels((current) => current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel]);
  }

  async function generatePlan() {
    if (channels.length === 0 || isGenerating) return;
    setError('');
    setIsGenerating(true);
    setStreamedBrief('');

    const prompt = `Create a concise, practical marketing campaign brief for this business profile:\n- Business: ${businessContext.name}\n- Industry: ${businessContext.industry}\n- Audience: ${businessContext.audience}\n- Location: ${businessContext.location}\n\nUse the onboarding profile above as the source of truth. Do not ask for business information again.\nCampaign objective: ${selectedObjective}\nOffer or focus: ${offer || 'Create the strongest appropriate offer based on the business profile.'}\nChannels: ${channels.join(', ')}\nPreferred first publish date: ${startDate || 'next available day'} at ${publishTime}\n\nReturn Markdown with: campaign title, core message, channel-specific posts, a 7-day schedule, simple success measures, and the first action to take today.`;

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: [{role: 'user', content: prompt}]}),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({error: 'The AI service is unavailable.'}));
        throw new Error(typeof payload.error === 'string' ? payload.error : 'The AI service is unavailable.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let content = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {stream: true}).replace(/\r\n/g, '\n');
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const data = event.split('\n').filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
          if (!data || data === '[DONE]') continue;
          const payload = JSON.parse(data) as {choices?: Array<{delta?: {content?: string}}>};
          const next = payload.choices?.[0]?.delta?.content;
          if (next) {
            content += next;
            setStreamedBrief(content);
          }
        }
      }

      if (!content.trim()) throw new Error('The AI did not return a campaign brief.');
      const plan: CampaignPlan = {
        id: Date.now(),
        title: content.match(/^#{1,2}\s+(.+)$/m)?.[1] || `${selectedObjective} campaign`,
        goal: selectedObjective,
        channels,
        createdAt: 'Just now',
        content,
      };
      setPlans((current) => [plan, ...current]);
      setActivePlan(plan);
      setSheetOpen(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not create your campaign brief.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1060px] pb-10 pt-3">
        <motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}} className="mb-7">
          <p className="text-sm font-medium text-muted">Marketing</p>
          <h1 className="mt-1 text-[30px] font-semibold leading-tight text-heading sm:text-[34px]">Create your next campaign.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">EthioGrowth AI uses the business context you completed during onboarding, so you can move straight to the campaign.</p>
        </motion.section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <Card className="rounded-[24px] border-border/70 bg-card p-5 shadow-[0_12px_30px_rgba(25,27,31,0.035)] sm:p-6">
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-border/70 bg-gray/45 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card text-heading"><Icon name="ai-homepage" size={17} /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-heading">Using {businessContext.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{businessContext.industry} in {businessContext.location}. Your audience and brand details are already included.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Select label="Campaign goal" value={objective} onChange={setObjective} options={objectives} />
              <DatePicker label="First publish date" value={startDate} onChange={setStartDate} />
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-heading">Offer or focus</label>
                <Input value={offer} onChange={(event) => setOffer(event.target.value)} placeholder="Example: weekday coffee and pastry offer" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-heading">Publish time</label>
                <Input type="time" value={publishTime} onChange={(event) => setPublishTime(event.target.value)} />
              </div>
              <div>
                <p className="mb-2 block text-sm font-medium text-heading">Channels</p>
                <div className="flex flex-wrap gap-2">
                  {channelOptions.map((channel) => {
                    const selected = channels.includes(channel.id);
                    return <button key={channel.id} type="button" onClick={() => toggleChannel(channel.id)} className={cn('flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors', selected ? 'border-heading bg-heading text-bg' : 'border-border bg-card text-muted hover:bg-gray')}><Icon name={channel.icon} size={15} className={selected ? 'text-bg' : 'text-muted'} />{channel.id}</button>;
                  })}
                </div>
              </div>
            </div>

            {error && <p className="mt-5 rounded-xl bg-[#fff0f0] px-3 py-2.5 text-sm text-[#c23434] dark:bg-[#3a1518] dark:text-[#ff9d9d]">{error}</p>}

            <div className="mt-7 flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted">The AI will create an editable campaign brief with a schedule and channel-ready copy.</p>
              <Button variant="dark" size="md" onClick={generatePlan} disabled={isGenerating || channels.length === 0} className="shrink-0">
                {isGenerating ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-bg/40 border-t-bg" />Creating brief</> : <><Icon name="ai-send-message" size={16} />Create with AI</>}
              </Button>
            </div>
          </Card>

          <Card className="rounded-[24px] border-border/70 bg-card p-5 shadow-[0_12px_30px_rgba(25,27,31,0.035)]">
            <p className="text-sm font-semibold text-heading">Campaign context</p>
            <div className="mt-4 space-y-4">
              <div><p className="text-xs text-muted">Business</p><p className="mt-1 text-sm font-medium text-heading">{businessContext.name}</p></div>
              <div><p className="text-xs text-muted">Audience</p><p className="mt-1 text-sm leading-6 text-heading">{businessContext.audience}</p></div>
              <div><p className="text-xs text-muted">AI will prepare</p><ul className="mt-2 space-y-2 text-sm text-text"><li className="flex gap-2"><Icon name="copy-success" size={15} className="mt-0.5 text-muted" />Channel-ready messages</li><li className="flex gap-2"><Icon name="copy-success" size={15} className="mt-0.5 text-muted" />A simple 7-day schedule</li><li className="flex gap-2"><Icon name="copy-success" size={15} className="mt-0.5 text-muted" />Clear measures of success</li></ul></div>
            </div>
          </Card>
        </div>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between"><div><h2 className="text-base font-semibold text-heading">Campaign briefs</h2><p className="mt-1 text-sm text-muted">Open a generated brief whenever you need it.</p></div></div>
          <Card className="overflow-hidden rounded-[24px] border-border/70 bg-card">
            {plans.length === 0 ? (
              <div className="flex min-h-36 flex-col items-center justify-center px-5 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray text-muted"><Icon name="document-text" size={18} /></span><p className="mt-3 text-sm font-medium text-heading">No campaign briefs yet</p><p className="mt-1 text-xs text-muted">Create one above and it will appear here.</p></div>
            ) : plans.map((plan) => (
              <button key={plan.id} type="button" onClick={() => { setActivePlan(plan); setSheetOpen(true); }} className="flex w-full items-center gap-3 border-b border-border/70 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-gray/45"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray text-heading"><Icon name="document-text" size={17} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-heading">{plan.title}</span><span className="mt-1 block truncate text-xs text-muted">{plan.goal} - {plan.channels.join(', ')} - {plan.createdAt}</span></span><Icon name="arrow-right4" size={15} className="text-muted" /></button>
            ))}
          </Card>
        </section>

        {isGenerating && streamedBrief && <p className="mt-4 text-sm text-muted">EthioGrowth AI is shaping your brief...</p>}
      </div>
      <PlanSheet
        plan={activePlan}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onPlanUpdate={(id, updates) => {
          setPlans((current) => current.map((item) => (item.id === id ? {...item, ...updates} : item)));
          setActivePlan((current) => (current?.id === id ? {...current, ...updates} : current));
        }}
      />
    </>
  );
}
