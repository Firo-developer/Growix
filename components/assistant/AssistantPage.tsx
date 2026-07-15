'use client';

import {useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {AnimatedMarkdown, StreamingMarkdownLine} from '@/components/assistant/AnimatedMarkdown';
import {useSidebar} from '@/components/layout/SidebarContext';
import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/utils';
import {
  readAssistantConversations,
  takeAssistantConversationRestore,
  writeAssistantConversations,
  type StoredConversation,
} from '@/lib/assistant-conversations';

const PROMPT_FONT_SIZE = 18;
const PROMPT_LINE_HEIGHT = 28;
const RESPONSE_STREAM_FONT_SIZE = 18;
const RESPONSE_STREAM_LINE_HEIGHT = 30;

interface Attachment {
  id: string;
  name: string;
  url: string;
  isImage: boolean;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  attachments: Attachment[];
  markdownLines?: string[];
}

interface SavedConversation extends StoredConversation {
  messages: ChatMessage[];
}

const QUICK_STARTS = [
  {label: 'Marketing plan', detail: 'Build a focused plan for this week', prompt: 'Create a simple marketing plan for my business.', icon: 'status-up'},
  {label: 'Find customers', detail: 'Identify the people to reach next', prompt: 'How can I find more customers this week?', icon: 'gps'},
  {label: 'Plan content', detail: 'Turn one idea into useful posts', prompt: 'Plan a week of social media content for my business.', icon: 'global'},
  {label: 'Improve sales', detail: 'Find the next sales opportunity', prompt: 'How can I improve my sales process?', icon: 'subtitle'},
];

function takeTypingTokens(input: string, isFinal = false) {
  const tokens: string[] = [];
  let index = 0;

  while (index < input.length) {
    const remaining = input.slice(index);

    if (remaining.startsWith('$$')) {
      const end = remaining.indexOf('$$', 2);
      if (end === -1 && !isFinal) break;
      const length = end === -1 ? remaining.length : end + 2;
      tokens.push(remaining.slice(0, length));
      index += length;
      continue;
    }

    if ((remaining.startsWith('$') || remaining.startsWith('`')) && !remaining.startsWith('$$')) {
      const marker = remaining[0];
      const end = remaining.indexOf(marker, 1);
      if (end === -1 && !isFinal) break;
      const length = end === -1 ? remaining.length : end + 1;
      tokens.push(remaining.slice(0, length));
      index += length;
      continue;
    }

    const whitespace = remaining.match(/^\s+/)?.[0];
    if (whitespace) {
      tokens.push(whitespace);
      index += whitespace.length;
      continue;
    }

    const boundary = remaining.search(/[\s$`]/);
    const length = boundary === -1 ? remaining.length : boundary;
    const token = remaining.slice(0, length);
    if (index + length === input.length && !isFinal) break;
    tokens.push(token);
    index += length;
  }

  return {tokens, remainder: input.slice(index)};
}

function getStableStreamingLines(content: string) {
  const rawLines = content.split('\n');
  const completeLineCount = rawLines.length - 1;
  const completed: string[] = [];
  let mathBlock: string[] | null = null;

  for (const line of rawLines.slice(0, Math.max(completeLineCount, 0))) {
    if (mathBlock) {
      mathBlock.push(line);
      if (line.trim() === '$$') {
        completed.push(mathBlock.join('\n'));
        mathBlock = null;
      }
      continue;
    }

    if (line.trim() === '$$') {
      mathBlock = [line];
      continue;
    }

    completed.push(line);
  }

  const activeLine = content.endsWith('\n') || mathBlock ? '' : rawLines.at(-1) ?? '';
  return {completed, activeLine};
}

function StreamingAssistantReply({content}: {content: string}) {
  const {completed, activeLine} = getStableStreamingLines(content);

  return (
    <motion.article initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.25}} className="max-w-2xl" aria-live="polite" aria-label="Assistant is responding">
      <div className="space-y-1">
        {completed.map((line, index) => (
          <div key={`stream-line-${index}`} style={{fontSize: `${RESPONSE_STREAM_FONT_SIZE}px`, lineHeight: `${RESPONSE_STREAM_LINE_HEIGHT}px`}}>
            <StreamingMarkdownLine content={line} animate={false} />
          </div>
        ))}
        {activeLine && (
          <div style={{fontSize: `${RESPONSE_STREAM_FONT_SIZE}px`, lineHeight: `${RESPONSE_STREAM_LINE_HEIGHT}px`}}>
            <StreamingMarkdownLine content={activeLine} animate={false} />
          </div>
        )}
      </div>
      <span className="ml-1 inline-block h-5 w-0.5 animate-pulse rounded-full bg-heading align-[-3px]" aria-hidden="true" />
    </motion.article>
  );
}

function buildReply(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('who are you')) {
    return `## Growix

I'm **Growix**, your business growth assistant. I help you turn a business question into a practical, actionable plan.

### What I can help you with

- Create a **marketing strategy** or campaign
- Plan content for *Facebook*, *Instagram*, *TikTok*, and *Telegram*
- Improve your brand, customer targeting, or sales process
- Build a weekly growth checklist you can actually follow

> What would you like to grow today?`;
  }

  const trimmedPrompt = prompt.trim();

  return `## Growth plan starter

Thanks for sharing that. Here is a strong way to begin for **"${trimmedPrompt}"**.

First, identify the customer, the clearest offer, and the channel most likely to reach them.

### Recommended next steps

- Define **one measurable outcome** for this week
- Create a simple message focused on the customer benefit
- Choose one channel and test the message with a small audience
- Track results and refine the message after 3–5 days

---

| Step | Action | Priority |
| --- | --- | --- |
| 1 | Clarify your target customer | High |
| 2 | Write one clear offer message | High |
| 3 | Run a small channel test | Medium |

> I can turn this into a full action plan whenever you are ready.`;
}

function buildReplyLines(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('who are you')) {
    return [
      "I'm Growix, your business growth assistant.",
      'I help you turn a business question into a practical plan.',
      'Create marketing strategies and campaigns',
      'Plan content for Facebook, Instagram, TikTok, and Telegram',
      'Improve your brand, customer targeting, or sales process',
      'What would you like to grow today?',
    ];
  }

  const trimmedPrompt = prompt.trim();
  return [
    `Thanks for sharing that. For "${trimmedPrompt}", here is a strong way to begin.`,
    'First, identify your customer, your clearest offer, and the best channel to reach them.',
    'Define one measurable outcome for this week',
    'Create a simple message focused on the customer benefit',
    'Choose one channel and test with a small audience',
    'I can turn this into a full action plan whenever you are ready.',
  ];
}

function buildRealtimeReply(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('who are you')) {
    return `## Growix

I'm **Growix**, your business growth assistant. I help you turn a business question into a practical, actionable plan.

### What I can help you with

- Create a **marketing strategy** or campaign
- Plan content for *Facebook*, *Instagram*, *TikTok*, and *Telegram*
- Improve your brand, customer targeting, or sales process

### A quick way to start

1. Share the result you want this week
2. Choose one audience to focus on
3. Test one clear message

$$
\\text{Growth focus} = \\frac{\\text{customer clarity} + \\text{offer clarity}}{2}
$$

> What would you like to grow today?`;
  }

  const trimmedPrompt = prompt.trim();
  return `## Growth plan starter

Thanks for sharing that. Here is a strong way to begin for **"${trimmedPrompt}"**.

First, identify the customer, the clearest offer, and the channel most likely to reach them.

### Recommended next steps

- Define **one measurable outcome** for this week
- Create a simple message focused on the customer benefit
- Choose one channel and test the message with a small audience
- Track results and refine the message after 3-5 days

### Your first three actions

1. Clarify your target customer
2. Write one clear offer message
3. Run a small channel test

$$
\\text{Weekly focus score} = \\frac{\\text{clarity} + \\text{consistency}}{2}
$$

> I can turn this into a full action plan whenever you are ready.`;
}

function buildRealtimeLines(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('who are you')) {
    return [
      '## Growix',
      "I'm **Growix**, your business growth assistant.",
      'I help you turn a business question into a practical plan.',
      '### What I can help you with',
      '- Create a **marketing strategy** or campaign',
      '- Plan content for *Facebook*, *Instagram*, *TikTok*, and *Telegram*',
      '- Improve your brand, customer targeting, or sales process',
      '### A quick way to start',
      '1. Share the result you want this week',
      '2. Choose one audience to focus on',
      '3. Test one clear message',
      '$$\\text{Growth focus} = \\frac{\\text{customer clarity} + \\text{offer clarity}}{2}$$',
      '> What would you like to grow today?',
    ];
  }

  const trimmedPrompt = prompt.trim();
  return [
    '## Growth plan starter',
    `Thanks for sharing that. Here is a strong way to begin for **"${trimmedPrompt}"**.`,
    'First, identify the customer, the clearest offer, and the channel most likely to reach them.',
    '### Recommended next steps',
    '- Define **one measurable outcome** for this week',
    '- Create a simple message focused on the customer benefit',
    '- Choose one channel and test the message with a small audience',
    '- Track results and refine the message after 3-5 days',
    '### Your first three actions',
    '1. Clarify your target customer',
    '2. Write one clear offer message',
    '3. Run a small channel test',
    '$$\\text{Weekly focus score} = \\frac{\\text{clarity} + \\text{consistency}}{2}$$',
    '> I can turn this into a full action plan whenever you are ready.',
  ];
}

function AssistantReply({text, markdownLines}: {text: string; markdownLines?: string[]}) {
  const reply = text;
  const contentRef = useRef<HTMLDivElement>(null);

  function handleCopy() {
    const plainText = contentRef.current?.innerText ?? reply;
    void navigator.clipboard.writeText(plainText);
  }

  return (
    <motion.article initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.25}} className="max-w-2xl">
      <div ref={contentRef}>
        {markdownLines ? <ConversationStreamingReply lines={markdownLines} animate={false} /> : <AnimatedMarkdown content={reply} animate={false} />}
      </div>
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.6, duration: 0.25}}
        className="mt-4 flex items-center gap-1 text-muted">
        <button type="button" onClick={handleCopy} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray" aria-label="Copy response">
          <Icon name="copy" size={17} />
        </button>
        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray" aria-label="Regenerate response">
          <Icon name="refresh-arrow" size={17} />
        </button>
        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray" aria-label="Share response">
          <Icon name="export-arrow2" size={17} />
        </button>
      </motion.div>
    </motion.article>
  );
}

function ConversationStreamingReply({lines, animate = true, onLineComplete}: {lines: string[]; animate?: boolean; onLineComplete?: () => void}) {
  return (
    <motion.article
      initial={animate ? {opacity: 0, y: 8} : false}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl"
      aria-live="polite"
      aria-label="Assistant is responding">
      <div className="space-y-2">
        {lines.map((line, index) => (
          <div
            key={`${index}-${line}`}
            style={{fontSize: `${RESPONSE_STREAM_FONT_SIZE}px`, lineHeight: `${RESPONSE_STREAM_LINE_HEIGHT}px`}}
            className="text-heading">
            <StreamingMarkdownLine content={line} animate={animate} onAnimationComplete={index === lines.length - 1 ? onLineComplete : undefined} />
          </div>
        ))}
      </div>
    </motion.article>
  );
}

function UserMessage({message}: {message: ChatMessage}) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = message.text.length > 360;

  return (
    <motion.div id={`user-message-${message.id}`} initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}} className="scroll-mt-6 ml-auto w-fit max-w-[82%] sm:max-w-[540px]">
      {message.attachments.length > 0 && (
        <div className="mb-2 flex max-w-[280px] flex-wrap justify-end gap-2">
          {message.attachments.map((attachment) => (
            attachment.isImage ? (
              <img key={attachment.id} src={attachment.url} alt={attachment.name} className="h-16 w-16 rounded-xl object-cover" />
            ) : (
              <div key={attachment.id} className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray text-muted" title={attachment.name}>
                <Icon name="document" size={24} />
              </div>
            )
          ))}
        </div>
      )}

      {message.text && (
        <div className={cn('bg-gray text-heading', canCollapse ? 'rounded-[22px] px-4 py-3' : 'rounded-full px-4 py-2')}>
          <p className={cn('whitespace-pre-wrap text-[15px] leading-6', canCollapse && !expanded && 'max-h-[252px] overflow-hidden')}>
            {message.text}
          </p>
          {canCollapse && (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="mt-2 flex items-center gap-1 text-[13px] font-medium text-heading transition-opacity hover:opacity-70">
              {expanded ? 'Show less' : 'Show more'}
              <Icon name={expanded ? 'arrow-up' : 'arrow-down'} size={14} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function PromptComposer({
  value,
  attachments,
  isGenerating,
  onChange,
  onFilesSelect,
  onRemoveAttachment,
  onSubmit,
  onStop,
}: {
  value: string;
  attachments: Attachment[];
  isGenerating: boolean;
  onChange: (value: string) => void;
  onFilesSelect: (files: FileList) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onSubmit: () => void;
  onStop: () => void;
}) {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSend = Boolean(value.trim()) || attachments.length > 0;
  const textareaStyle = {
    fontSize: `${PROMPT_FONT_SIZE}px`,
    lineHeight: `${PROMPT_LINE_HEIGHT}px`,
  };

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const contentHeight = Math.min(textarea.scrollHeight, 240);
    textarea.style.height = `${Math.max(contentHeight, PROMPT_LINE_HEIGHT)}px`;
    setIsTextExpanded(contentHeight > PROMPT_LINE_HEIGHT + 8);
  }

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files?.length) onFilesSelect(files);
    event.target.value = '';
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend || isGenerating) return;
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (canSend && !isGenerating) onSubmit();
    }
  }

  const addButton = (className?: string) => (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      disabled={isGenerating}
      className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-heading transition-colors hover:bg-gray disabled:opacity-40', className)}
      aria-label="Add attachments">
      <Icon name="add" size={28} />
    </button>
  );

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        layout
        transition={{type: 'spring', stiffness: 380, damping: 32}}
        className="rounded-[28px] border border-border bg-card p-2 shadow-[0_16px_35px_rgba(18,18,18,0.05)] transition-shadow focus-within:shadow-[0_16px_35px_rgba(18,18,18,0.08)]">
        {attachments.length > 0 && (
          <motion.div initial={{opacity: 0, y: -6}} animate={{opacity: 1, y: 0}} className="mb-1.5 flex max-w-full gap-2 overflow-x-auto px-1 pt-1">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-gray">
                {attachment.isImage ? (
                  <img src={attachment.url} alt={attachment.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <Icon name="document" size={24} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-heading text-bg"
                  aria-label={`Remove ${attachment.name}`}>
                  <Icon name="x" size={9} className="text-bg" />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        <div className={cn('grid gap-2', isTextExpanded ? 'grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_auto]' : 'grid-cols-[auto_minmax(0,1fr)_auto] items-center')}>
          {addButton(cn(isTextExpanded ? 'col-start-1 row-start-2' : 'col-start-1 row-start-1'))}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onInput={resizeTextarea}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            style={textareaStyle}
            className={cn(
              'block min-w-0 resize-none bg-transparent font-normal text-heading outline-none placeholder:text-muted',
              isTextExpanded ? 'col-span-3 col-start-1 row-start-1 max-h-[220px] overflow-y-auto px-2 pt-1' : 'col-start-2 row-start-1 min-h-[28px] overflow-hidden py-0',
            )}
            aria-label="Ask the assistant"
          />

          <div className={cn('flex shrink-0 items-center gap-1.5', isTextExpanded ? 'col-start-3 row-start-2 justify-self-end' : 'col-start-3 row-start-1')}>
            <div className="flex items-center gap-1.5">
              {isGenerating ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-heading text-bg"
                  aria-label="Stop generating">
                  <span className="h-3 w-3 rounded-sm bg-bg" />
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
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx"
          onChange={handleFileChange}
          className="sr-only"
          tabIndex={-1}
        />
      </motion.div>
    </form>
  );
}

export function AssistantPage() {
  const {collapsed} = useSidebar();
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [typingVersion, setTypingVersion] = useState(0);
  const [modelComplete, setModelComplete] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyMenuId, setHistoryMenuId] = useState<number | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const activeRequestId = useRef(0);
  const streamedResponse = useRef('');
  const typingQueue = useRef<string[]>([]);
  const tokenizerBuffer = useRef('');
  const pendingScrollMessageId = useRef<number | null>(null);
  const objectUrls = useRef<string[]>([]);
  const restoredConversation = useRef(false);
  const [conversationsHydrated, setConversationsHydrated] = useState(false);

  useEffect(() => {
    setSavedConversations(readAssistantConversations() as SavedConversation[]);
    setConversationsHydrated(true);
  }, []);

  useEffect(() => {
    if (!conversationsHydrated) return;
    writeAssistantConversations(savedConversations);
  }, [conversationsHydrated, savedConversations]);

  useEffect(() => {
    return () => {
      abortController.current?.abort();
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const messageId = pendingScrollMessageId.current;
    if (!messageId) return;

    const frame = requestAnimationFrame(() => {
      document.getElementById(`user-message-${messageId}`)?.scrollIntoView({behavior: 'smooth', block: 'start'});
      pendingScrollMessageId.current = null;
    });

    return () => cancelAnimationFrame(frame);
  }, [messages]);

  function clearGeneration() {
    setIsGenerating(false);
    setStreamingContent('');
    setTypingVersion(0);
    setModelComplete(false);
    typingQueue.current = [];
    tokenizerBuffer.current = '';
  }

  function resetConversation() {
    activeRequestId.current += 1;
    abortController.current?.abort();
    abortController.current = null;
    if (messages.length > 0) {
      const firstQuestion = messages.find((message) => message.role === 'user')?.text || 'Untitled conversation';
      const lastReply = [...messages].reverse().find((message) => message.role === 'assistant')?.text || 'No assistant response yet.';
      const archivedMessages = messages.map((message) => ({...message, attachments: []}));

      setSavedConversations((current) => [
        {id: Date.now(), title: firstQuestion.slice(0, 52), preview: lastReply.slice(0, 86), messages: archivedMessages},
        ...current,
      ].slice(0, 12));
    }
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current = [];
    streamedResponse.current = '';
    pendingScrollMessageId.current = null;
    setMessages([]);
    setAttachments([]);
    setValue('');
    clearGeneration();
    setHistoryOpen(false);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const openNewChat = () => resetConversation();
    const toggleHistory = () => setHistoryOpen((current) => !current);

    window.addEventListener('assistant:new-chat', openNewChat);
    window.addEventListener('assistant:toggle-history', toggleHistory);
    return () => {
      window.removeEventListener('assistant:new-chat', openNewChat);
      window.removeEventListener('assistant:toggle-history', toggleHistory);
    };
  }, [messages]);

  useEffect(() => {
    if (!isGenerating) return;

    const nextToken = typingQueue.current[0];
    if (!nextToken) {
      if (!modelComplete) return;

      const content = streamedResponse.current.trim();
      if (content) {
        setMessages((current) => [
          ...current,
          {id: Date.now() + 1, role: 'assistant', text: content, attachments: []},
        ]);
      }
      abortController.current = null;
      clearGeneration();
      return;
    }

    const delay = nextToken.startsWith('$$') || nextToken.startsWith('$') || nextToken.startsWith('`')
      ? 28
      : /^\s+$/.test(nextToken)
        ? 4
        : 14;
    const timer = window.setTimeout(() => {
      const token = typingQueue.current.shift();
      if (!token) return;
      setStreamingContent((current) => current + token);
      setTypingVersion((current) => current + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isGenerating, modelComplete, streamingContent, typingVersion]);

  function appendStreamChunk(chunk: string) {
    streamedResponse.current += chunk;
    tokenizerBuffer.current += chunk;
    const {tokens, remainder} = takeTypingTokens(tokenizerBuffer.current);
    tokenizerBuffer.current = remainder;
    if (tokens.length > 0) {
      typingQueue.current.push(...tokens);
      setTypingVersion((current) => current + 1);
    }
  }

  function commitStream(requestId: number) {
    if (activeRequestId.current !== requestId) return;

    if (tokenizerBuffer.current) {
      const {tokens} = takeTypingTokens(tokenizerBuffer.current, true);
      typingQueue.current.push(...tokens);
      tokenizerBuffer.current = '';
    }

    setModelComplete(true);
    setTypingVersion((current) => current + 1);
  }

  async function startGeneration(prompt: string, uploadedAttachments: Attachment[]) {
    clearGeneration();
    activeRequestId.current += 1;
    const requestId = activeRequestId.current;
    const controller = new AbortController();
    abortController.current?.abort();
    abortController.current = controller;
    streamedResponse.current = '';
    typingQueue.current = [];
    tokenizerBuffer.current = '';
    setIsGenerating(true);
    setStreamingContent('');
    setTypingVersion(0);

    const attachmentDetails = uploadedAttachments.length > 0
      ? `\n\nAttached files: ${uploadedAttachments.map((attachment) => attachment.name).join(', ')}. Ask for any missing details you need from these files.`
      : '';
    const history = messages.map((message) => ({role: message.role, content: message.text}));

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        signal: controller.signal,
        body: JSON.stringify({messages: [...history, {role: 'user', content: `${prompt || 'Please review my uploaded files.'}${attachmentDetails}`}]}),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({error: 'The assistant is unavailable right now.'}));
        throw new Error(typeof payload.error === 'string' ? payload.error : 'The assistant is unavailable right now.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let eventBuffer = '';
      let complete = false;

      while (!complete) {
        const {done, value: chunk} = await reader.read();
        if (done) break;

        eventBuffer += decoder.decode(chunk, {stream: true}).replace(/\r\n/g, '\n');
        const events = eventBuffer.split('\n\n');
        eventBuffer = events.pop() ?? '';

        for (const event of events) {
          const data = event
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trimStart())
            .join('\n');

          if (!data) continue;
          if (data === '[DONE]') {
            complete = true;
            break;
          }

          try {
            const payload = JSON.parse(data) as {choices?: Array<{delta?: {content?: string}}>; error?: {message?: string}};
            if (payload.error?.message) throw new Error(payload.error.message);
            const content = payload.choices?.[0]?.delta?.content;
            if (content) appendStreamChunk(content);
          } catch (error) {
            if (error instanceof SyntaxError) continue;
            throw error;
          }
        }
      }

      commitStream(requestId);
    } catch (error) {
      if (controller.signal.aborted || activeRequestId.current !== requestId) return;

      const message = error instanceof Error ? error.message : 'The assistant could not complete this request.';
      setMessages((current) => [
        ...current,
        {id: Date.now() + 1, role: 'assistant', text: `I could not complete that request. ${message}`, attachments: []},
      ]);
      abortController.current = null;
      clearGeneration();
    }
  }

  function handleFilesSelect(files: FileList) {
    const nextAttachments = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return {id: `${file.name}-${file.lastModified}-${Math.random()}`, name: file.name, url, isImage: file.type.startsWith('image/')};
    });

    setAttachments((current) => [...current, ...nextAttachments]);
  }

  function submitMessage(promptOverride?: string) {
    const text = (promptOverride ?? value).trim();
    if (!text && attachments.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text,
      attachments,
    };

    if (messages.length > 0) pendingScrollMessageId.current = userMessage.id;
    setMessages((current) => [...current, userMessage]);
    setValue('');
    setAttachments([]);
    void startGeneration(text || 'Please review my uploaded files.', attachments);
  }

  function stopGeneration() {
    const content = streamedResponse.current.trim();
    activeRequestId.current += 1;
    abortController.current?.abort();
    abortController.current = null;
    if (content) {
      setMessages((current) => [
        ...current,
        {id: Date.now() + 1, role: 'assistant', text: content, attachments: []},
      ]);
    }
    streamedResponse.current = '';
    clearGeneration();
  }

  function restoreConversation(conversation: SavedConversation) {
    activeRequestId.current += 1;
    abortController.current?.abort();
    abortController.current = null;
    streamedResponse.current = '';
    setMessages(conversation.messages);
    setValue('');
    setAttachments([]);
    clearGeneration();
    setHistoryOpen(false);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    if (restoredConversation.current) return;
    const restoreId = takeAssistantConversationRestore();
    if (!restoreId) return;
    const conversation = savedConversations.find((item) => item.id === restoreId);
    if (!conversation) return;
    restoredConversation.current = true;
    restoreConversation(conversation);
  }, [savedConversations]);

  function renameConversation(conversation: SavedConversation) {
    const title = window.prompt('Rename chat', conversation.title)?.trim();
    if (!title) return;
    setSavedConversations((current) => current.map((item) => item.id === conversation.id ? {...item, title} : item));
    setHistoryMenuId(null);
  }

  function togglePinnedConversation(conversation: SavedConversation) {
    setSavedConversations((current) => current.map((item) => item.id === conversation.id ? {...item, pinned: !item.pinned} : item));
    setHistoryMenuId(null);
  }

  function shareConversation(conversation: SavedConversation) {
    void navigator.clipboard.writeText(conversation.messages.map((message) => `${message.role === 'user' ? 'You' : 'Growix'}: ${message.text}`).join('\n\n'));
    setHistoryMenuId(null);
  }

  function deleteConversation(id: number) {
    setSavedConversations((current) => current.filter((conversation) => conversation.id !== id));
    setHistoryMenuId(null);
  }

  const matchingConversations = savedConversations
    .filter((conversation) => `${conversation.title} ${conversation.preview}`.toLowerCase().includes(historySearch.trim().toLowerCase()))
    .sort((left, right) => Number(Boolean(right.pinned)) - Number(Boolean(left.pinned)) || right.id - left.id);
  const historyGroups = [
    {label: 'Yesterday', conversations: matchingConversations.slice(0, 1)},
    {label: '7 Days', conversations: matchingConversations.slice(1, 3)},
    {label: '30 Days', conversations: matchingConversations.slice(3, 6)},
    {label: 'Earlier', conversations: matchingConversations.slice(6)},
  ].filter((group) => group.conversations.length > 0);

  const historyPanel = (
    <AnimatePresence>
      {historyOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close chat history"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={() => setHistoryOpen(false)}
            className="fixed inset-0 z-40 bg-heading/10 backdrop-blur-[1px]"
          />
          <motion.aside
            initial={{opacity: 0, x: 28}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 28}}
            transition={{type: 'spring', stiffness: 360, damping: 32}}
            aria-label="Chat history"
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[320px] flex-col border-l border-border/75 bg-card px-3 py-4 shadow-[-18px_0_45px_rgba(25,27,31,0.1)] sm:px-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-heading">Chat history</p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={resetConversation} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="New chat">
                  <Icon name="new-chat" size={17} />
                </button>
                <button type="button" onClick={() => setHistoryOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Close history">
                  <Icon name="x" size={17} />
                </button>
              </div>
            </div>

            <label className="mt-5 flex h-10 items-center gap-2 rounded-xl bg-gray px-3 text-muted transition-colors focus-within:bg-gray/80">
              <Icon name="search" size={16} />
              <input value={historySearch} onChange={(event) => setHistorySearch(event.target.value)} placeholder="Search chats" className="min-w-0 flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-muted" />
            </label>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:theme(colors.border)_transparent] [scrollbar-width:thin]">
              {messages.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 px-2 text-xs font-medium text-muted">Today</p>
                  <div className="rounded-xl bg-gray/65 px-2.5 py-2 text-sm font-medium text-heading">
                    <p className="truncate">{messages.find((message) => message.role === 'user')?.text || 'New conversation'}</p>
                  </div>
                </div>
              )}
              {historyGroups.map((group) => (
                <div key={group.label} className="mb-5">
                  <p className="mb-2 px-2 text-xs font-medium text-muted">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.conversations.map((conversation) => (
                      <div key={conversation.id} className="group relative">
                        <button type="button" onClick={() => restoreConversation(conversation)} className="block w-full rounded-xl px-2.5 py-2 pr-9 text-left text-sm font-medium text-heading transition-colors hover:bg-gray/70">
                          <span className="block truncate">{conversation.pinned ? 'Pinned: ' : ''}{conversation.title}</span>
                        </button>
                        <button type="button" onClick={() => setHistoryMenuId((current) => current === conversation.id ? null : conversation.id)} className="absolute right-1 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-border/65 hover:text-heading group-hover:flex" aria-label={`More options for ${conversation.title}`}>
                          <span className="mb-1 text-lg leading-none">...</span>
                        </button>
                        <AnimatePresence>
                          {historyMenuId === conversation.id && (
                            <motion.div initial={{opacity: 0, scale: 0.96, y: -4}} animate={{opacity: 1, scale: 1, y: 0}} exit={{opacity: 0, scale: 0.96, y: -4}} className="absolute right-0 top-9 z-20 w-32 rounded-2xl border border-border bg-card p-1.5 shadow-[0_12px_28px_rgba(25,27,31,0.14)]">
                              <button type="button" onClick={() => renameConversation(conversation)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-heading hover:bg-gray"><Icon name="edit" size={15} />Rename</button>
                              <button type="button" onClick={() => togglePinnedConversation(conversation)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-heading hover:bg-gray"><Icon name="star2" size={15} />{conversation.pinned ? 'Unpin' : 'Pin'}</button>
                              <button type="button" onClick={() => shareConversation(conversation)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-heading hover:bg-gray"><Icon name="export-arrow2" size={15} />Share</button>
                              <button type="button" onClick={() => deleteConversation(conversation.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-[#db3d3d] hover:bg-[#fff0f0]"><Icon name="x" size={15} />Delete</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {messages.length === 0 && historyGroups.length === 0 && (
                <div className="px-2 pt-5 text-center">
                  <Icon name="conversation-box" size={20} className="mx-auto text-muted" />
                  <p className="mt-3 text-sm font-medium text-heading">No chats found</p>
                  <p className="mt-1 text-xs leading-5 text-muted">Your previous conversations appear here.</p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  const hasConversation = messages.length > 0 || isGenerating;
  const composer = (
    <PromptComposer
      value={value}
      attachments={attachments}
      isGenerating={isGenerating}
      onChange={setValue}
      onFilesSelect={handleFilesSelect}
      onRemoveAttachment={(attachmentId) => setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId))}
      onSubmit={submitMessage}
      onStop={stopGeneration}
    />
  );

  if (!hasConversation) {
    return (
      <>
        <section className="flex h-[calc(100dvh-2.5rem)] items-center justify-center overflow-hidden">
          <div className="w-full max-w-[770px]">
            <div className="mb-6 flex flex-col items-center text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card text-heading shadow-[0_8px_22px_rgba(25,27,31,0.04)] dark:bg-card">
                <Icon name="ai-send-message" size={19} />
              </span>
              <p className="mt-3 text-sm font-medium text-heading">Growix workspace</p>
              <p className="mt-1 text-sm text-muted">Choose a starting point or ask a question in your own words.</p>
            </div>
            <div>{composer}</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {QUICK_STARTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => submitMessage(item.prompt)}
                  className="group flex min-h-[76px] items-center gap-3 rounded-2xl border border-border/75 bg-card px-4 py-3 text-left shadow-[0_8px_20px_rgba(25,27,31,0.025)] transition-colors hover:bg-gray/55">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray text-heading transition-colors group-hover:bg-border/75">
                    <Icon name={item.icon} size={17} />
                  </span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-heading">{item.label}</span><span className="mt-1 block text-xs leading-5 text-muted">{item.detail}</span></span>
                  <Icon name="arrow-right4" size={14} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </section>
        {historyPanel}
      </>
    );
  }

  return (
    <>
    <section className="min-h-[calc(100dvh-3.5rem)] pb-32">
      <div className="mx-auto max-w-[770px] space-y-8 pt-6">
        {messages.map((message) => (
          message.role === 'user'
            ? <UserMessage key={message.id} message={message} />
            : <AssistantReply key={message.id} text={message.text} markdownLines={message.markdownLines} />
        ))}

        {isGenerating && !streamingContent && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex h-8 items-center" aria-label="Assistant is thinking">
            <motion.span
              className="h-3 w-3 rounded-full bg-heading"
              animate={{opacity: [0.35, 1, 0.35], scale: [0.82, 1, 0.82]}}
              transition={{duration: 0.95, repeat: Infinity, ease: 'easeInOut'}}
            />
          </motion.div>
        )}

        {isGenerating && streamingContent && (
          <StreamingAssistantReply content={streamingContent} />
        )}
      </div>

      <div className={cn('fixed bottom-2 z-30 left-4 right-4 sm:bottom-3', collapsed ? 'lg:left-[74px]' : 'lg:left-[276px]')}>
        <div className="mx-auto max-w-[770px]">
          {composer}
        </div>
      </div>
    </section>
    {historyPanel}
    </>
  );
}
