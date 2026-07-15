'use client';

import {useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent, type KeyboardEvent} from 'react';
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

const SHEET_PROMPT_FONT_SIZE = 15;
const SHEET_PROMPT_LINE_HEIGHT = 22;
const SHEET_RESPONSE_FONT_SIZE = 14;
const SHEET_RESPONSE_LINE_HEIGHT = 22;
const SHEET_PROMPT_MAX_WIDTH = 560;

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

const SHEET_ACTION_BUTTON =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray hover:text-heading';

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

function SheetInlineUserMessage({text}: {text: string}) {
  return (
    <p className="whitespace-pre-wrap text-[13px] leading-5 text-muted">{text}</p>
  );
}

function SheetInlineAssistantMessage({text}: {text: string}) {
  return (
    <div className="text-[13px] leading-[22px] text-heading [&_.markdown-body]:text-[13px] [&_.markdown-body]:leading-[22px]">
      <AnimatedMarkdown content={text} animate={false} />
    </div>
  );
}

function SheetInlineStreamingReply({content}: {content: string}) {
  const lines = content.split('\n');

  return (
    <div className="text-[13px] leading-[22px] text-heading" aria-live="polite">
      <div className="space-y-0.5">
        {lines.map((line, index) => (
          <div key={`stream-line-${index}`} style={{fontSize: `${SHEET_RESPONSE_FONT_SIZE}px`, lineHeight: `${SHEET_RESPONSE_LINE_HEIGHT}px`}}>
            <StreamingMarkdownLine content={line} animate={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanStreamingBrief({content}: {content: string}) {
  const lines = content.split('\n');

  return (
    <div aria-live="polite">
      <div className="space-y-1">
        {lines.map((line, index) => (
          <div key={`brief-line-${index}`}>
            <StreamingMarkdownLine content={line} animate={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanChatPanel({
  open,
  planTitle,
  content,
  onContentUpdate,
  onBriefRegenerationStart,
  onBriefStream,
  onBriefRegenerationCancel,
  onExpandedChange,
}: {
  open: boolean;
  planTitle: string;
  content: string;
  onClose: () => void;
  onContentUpdate: (content: string, title?: string) => void;
  onBriefRegenerationStart?: () => void;
  onBriefStream?: (brief: string) => void;
  onBriefRegenerationCancel?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const [input, setInput] = useState('');
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingReply, setStreamingReply] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showResponseArea = messages.some((message) => message.role === 'assistant') || Boolean(streamingReply.trim());

  useEffect(() => {
    onExpandedChange?.(showResponseArea);
  }, [showResponseArea, onExpandedChange]);

  useEffect(() => {
    if (!open) {
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
    if (showResponseArea) {
      messagesEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
    }
  }, [messages, streamingReply, showResponseArea]);

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const contentHeight = Math.min(textarea.scrollHeight, showResponseArea ? 120 : 96);
    textarea.style.height = `${Math.max(contentHeight, SHEET_PROMPT_LINE_HEIGHT)}px`;
    setIsTextExpanded(contentHeight > SHEET_PROMPT_LINE_HEIGHT + 8);
  }

  useEffect(() => {
    resizeTextarea();
  }, [input, open, showResponseArea]);

  async function sendMessage() {
    const prompt = input.trim();
    if (!prompt || isGenerating) return;

    setError('');
    setInput('');
    const userMessage: ChatMessage = {id: Date.now(), role: 'user', text: prompt};
    setMessages((current) => [...current, userMessage]);
    setIsGenerating(true);
    setStreamingReply('');

    const history = messages.map((message) => ({role: message.role, content: message.text}));
    const enrichedPrompt = `${prompt}\n\nCurrent campaign brief to explain or edit:\n${content}\n\nRespond in two parts separated by exactly "${BRIEF_DELIMITER}":\n1. A concise, friendly reply explaining what you changed or answering the question.\n2. The complete updated campaign brief in Markdown. Always include the full brief, even for small edits or pure explanations.`;

    try {
      let briefStarted = false;

      const fullResponse = await streamAssistantResponse(
        [
          ...history,
          {role: 'user', content: enrichedPrompt},
        ],
        (streamed) => {
          const markerIndex = streamed.indexOf(BRIEF_DELIMITER);
          if (markerIndex === -1) {
            setStreamingReply(streamed.trim());
            return;
          }

          if (!briefStarted) {
            briefStarted = true;
            onBriefRegenerationStart?.();
          }

          const reply = streamed.slice(0, markerIndex).trim();
          const brief = streamed.slice(markerIndex + BRIEF_DELIMITER.length).trim();
          setStreamingReply(reply);
          if (brief) onBriefStream?.(brief);
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

  const canSend = Boolean(input.trim()) && !isGenerating;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          layout
          initial={{y: 12, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: 12, opacity: 0}}
          transition={{type: 'spring', stiffness: 380, damping: 34}}
          className="absolute bottom-3 left-3 z-20 w-[min(var(--sheet-prompt-width),calc(100%-1.5rem))] sm:bottom-4 sm:left-4"
          style={{'--sheet-prompt-width': `${SHEET_PROMPT_MAX_WIDTH}px`} as CSSProperties}>
          <div className={cn('rounded-[20px]', isGenerating && 'sheet-chat-generating-border')}>
            <div
              className={cn(
                'sheet-chat-panel-inner flex flex-col overflow-hidden bg-card/95 shadow-[0_6px_20px_rgba(18,18,18,0.06)] backdrop-blur-sm transition-[max-height,border-color] duration-300',
                isGenerating ? 'rounded-[18px]' : 'rounded-[20px] border border-border/70',
                showResponseArea ? 'max-h-[min(380px,46vh)]' : '',
              )}>
            <AnimatePresence initial={false}>
              {showResponseArea && (
                <motion.div
                  initial={{height: 0, opacity: 0}}
                  animate={{height: 'auto', opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
                  className="min-h-0 overflow-y-auto border-b border-border/50 px-3 py-2.5 [scrollbar-color:theme(colors.border)_transparent] [scrollbar-width:thin]">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id}>
                        {message.role === 'user'
                          ? <SheetInlineUserMessage text={message.text} />
                          : <SheetInlineAssistantMessage text={message.text} />}
                      </div>
                    ))}
                    {streamingReply && <SheetInlineStreamingReply content={streamingReply} />}
                    <div ref={messagesEndRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="shrink-0 px-2 py-1.5">
              {error && (
                <p className="mb-1.5 rounded-xl bg-[#fff0f0] px-2.5 py-1.5 text-[11px] text-[#c23434] dark:bg-[#3a1518] dark:text-[#ff9d9d]">
                  {error}
                </p>
              )}
              <div className={cn('grid gap-1.5', isTextExpanded ? 'grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto]' : 'grid-cols-[minmax(0,1fr)_auto] items-center')}>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={handleChange}
                  onInput={resizeTextarea}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI to explain or improve this brief..."
                  style={{fontSize: `${SHEET_PROMPT_FONT_SIZE}px`, lineHeight: `${SHEET_PROMPT_LINE_HEIGHT}px`}}
                  className={cn(
                    'block min-w-0 resize-none bg-transparent font-normal text-heading outline-none placeholder:text-muted',
                    isTextExpanded
                      ? 'col-span-2 col-start-1 row-start-1 max-h-[120px] overflow-y-auto px-1.5 pt-0.5'
                      : 'col-start-1 row-start-1 min-h-[22px] overflow-hidden py-0 pl-1.5',
                  )}
                  aria-label="Ask AI to refine the campaign brief"
                />
                {!isGenerating && (
                  <div className={cn('flex shrink-0 items-center justify-end', isTextExpanded ? 'col-start-2 row-start-2' : 'col-start-2 row-start-1')}>
                    <motion.button
                      type="submit"
                      disabled={!canSend}
                      initial={false}
                      animate={{scale: canSend ? 1 : 0.88, opacity: canSend ? 1 : 0.7}}
                      transition={{type: 'spring', stiffness: 420, damping: 25}}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-heading text-bg transition-opacity enabled:hover:opacity-90 disabled:bg-[#A8A8AA]"
                      aria-label="Send message">
                      <Icon name="arrow-up" size={15} className="text-bg" />
                    </motion.button>
                  </div>
                )}
              </div>
            </form>
            </div>
          </div>
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
  const [isBriefStreaming, setIsBriefStreaming] = useState(false);
  const [briefSnapshot, setBriefSnapshot] = useState('');
  const [streamingBrief, setStreamingBrief] = useState('');
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const hideBriefSnapshot = streamingBrief.trim().length > 80;
  const showBriefOverlay = isBriefStreaming && Boolean(streamingBrief.trim());

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setChatOpen(false);
      setChatExpanded(false);
      setIsBriefStreaming(false);
      setBriefSnapshot('');
      setStreamingBrief('');
    }
  }, [open]);

  useEffect(() => {
    if (plan) {
      setContent(plan.content);
      setIsBriefStreaming(false);
      setBriefSnapshot('');
      setStreamingBrief('');
    }
  }, [plan?.id]);

  useEffect(() => {
    if (showBriefOverlay) {
      contentScrollRef.current?.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [showBriefOverlay, streamingBrief]);

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

  function handleBriefRegenerationStart() {
    setBriefSnapshot(content);
    setIsBriefStreaming(true);
    setStreamingBrief('');
  }

  function handleBriefStream(partialBrief: string) {
    setStreamingBrief(partialBrief);
  }

  function handleContentUpdate(nextContent: string, nextTitle?: string) {
    if (!plan) return;
    setContent(nextContent);
    setContentVersion((current) => current + 1);
    setIsBriefStreaming(false);
    setStreamingBrief('');
    setBriefSnapshot('');
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
              'bottom-2 right-2 top-2 rounded-[24px] sm:bottom-4 sm:right-4 sm:top-4',
              expanded
                ? 'w-[calc(100vw-1rem)] sm:w-[min(960px,calc(100vw-2rem))]'
                : 'w-[calc(100vw-1rem)] sm:w-[min(640px,calc(100vw-2rem))]',
            )}>
            <div className="p-2.5 sm:p-3">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[26px] border border-border/75 bg-card/95 px-3 py-2 shadow-[0_8px_24px_rgba(25,27,31,0.04)] backdrop-blur-sm sm:px-3.5 sm:py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/75 bg-card text-heading shadow-[0_4px_10px_rgba(25,27,31,0.04)]">
                    <Icon name="document-text" size={16} />
                  </span>
                  <div className="min-w-0 pr-1">
                    <p className="truncate text-sm font-semibold text-heading">{plan.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">AI campaign brief</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-0.5 overflow-hidden rounded-[26px] border border-border/75 bg-card/85 py-0.5 pr-1 shadow-[0_8px_24px_rgba(25,27,31,0.04)] backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setChatOpen((current) => !current)}
                    className={cn(
                      SHEET_ACTION_BUTTON,
                      chatOpen && 'bg-gray text-heading',
                    )}
                    aria-label={chatOpen ? 'Close AI chat' : 'Open AI chat'}>
                    <Icon name="conversation-box" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    className={SHEET_ACTION_BUTTON}
                    aria-label={expanded ? 'Reduce sheet' : 'Expand sheet'}>
                    <Icon name={expanded ? 'maximize_1' : 'maximize'} size={16} />
                  </button>
                  <button type="button" onClick={copyPlan} className={SHEET_ACTION_BUTTON} aria-label="Copy campaign plan">
                    <Icon name="copy" size={16} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className={SHEET_ACTION_BUTTON} aria-label="Download campaign plan">
                        <Icon name="arrow-down3" size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className="z-[250] min-w-[170px] bg-card/95 backdrop-blur-xl">
                      <DropdownMenuItem onSelect={() => downloadPlan('markdown')}><Icon name="document-text" size={15} />Markdown (.md)</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => downloadPlan('text')}><Icon name="copy" size={15} />Plain text (.txt)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button type="button" onClick={onClose} className={SHEET_ACTION_BUTTON} aria-label="Close plan">
                    <Icon name="arrow-right3" size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div
              ref={contentScrollRef}
              className={cn(
                'min-h-0 flex-1 overflow-y-auto px-5 pt-3 transition-[padding-bottom] duration-300 sm:px-8',
                chatOpen ? (chatExpanded ? 'pb-[min(400px,48vh)]' : 'pb-16') : 'pb-7',
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

                {isBriefStreaming ? (
                  <div className="relative">
                    <AnimatePresence initial={false}>
                      {!hideBriefSnapshot && (
                        <motion.div
                          key="brief-snapshot"
                          initial={{opacity: 1, filter: 'blur(0px)'}}
                          animate={{
                            opacity: showBriefOverlay ? 0.35 : 0.55,
                            filter: showBriefOverlay ? 'blur(4px)' : 'blur(2px)',
                          }}
                          exit={{opacity: 0, filter: 'blur(8px)', height: 0, marginBottom: 0}}
                          transition={{duration: 0.45, ease: [0.22, 1, 0.36, 1]}}
                          className="origin-top overflow-hidden">
                          <AnimatedMarkdown content={briefSnapshot} animate={false} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {showBriefOverlay && (
                        <motion.div
                          key="brief-stream"
                          initial={{opacity: 0, y: 10}}
                          animate={{opacity: 1, y: 0}}
                          exit={{opacity: 0, y: -6}}
                          transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                          className={cn(
                            'rounded-2xl border border-border/60 bg-card/96 shadow-[0_10px_30px_rgba(25,27,31,0.08)] backdrop-blur-md',
                            hideBriefSnapshot ? 'relative' : 'absolute inset-x-0 top-0 z-10 px-4 py-4 sm:px-5',
                            !hideBriefSnapshot && 'sm:-mx-2',
                          )}>
                          <PlanStreamingBrief content={streamingBrief} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <AnimatedMarkdown key={contentVersion} content={content} animate={false} />
                )}
              </motion.div>
            </div>
            <PlanChatPanel
              open={chatOpen}
              planTitle={plan.title}
              content={content}
              onClose={() => setChatOpen(false)}
              onContentUpdate={handleContentUpdate}
              onBriefRegenerationStart={handleBriefRegenerationStart}
              onBriefStream={handleBriefStream}
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
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Growix uses the business context you completed during onboarding, so you can move straight to the campaign.</p>
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

        {isGenerating && streamedBrief && <p className="mt-4 text-sm text-muted">Growix is shaping your brief...</p>}
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
