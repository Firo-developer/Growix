'use client';

import {useEffect, useMemo, useState} from 'react';
import ReactMarkdown, {type Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {motion} from 'motion/react';
import {TextEffect} from '@/components/motion-primitives/text-effect';
import {cn} from '@/lib/utils';

export const RESPONSE_TEXT_CLASS = 'text-[18px] leading-8 text-heading';
export const RESPONSE_H2_CLASS = 'mb-3 mt-6 text-[24px] font-semibold tracking-tight text-heading first:mt-0';
export const RESPONSE_H3_CLASS = 'mb-2 mt-5 text-[20px] font-semibold tracking-tight text-heading first:mt-0';
export const RESPONSE_LIST_CLASS = 'text-[18px] leading-8 text-heading';

function createStaticComponents(): Components {
  return {
    h1: ({children}) => <h2 className={RESPONSE_H2_CLASS}>{children}</h2>,
    h2: ({children}) => <h3 className={RESPONSE_H3_CLASS}>{children}</h3>,
    h3: ({children}) => <h4 className="mb-2 mt-4 text-[18px] font-semibold text-heading first:mt-0">{children}</h4>,
    p: ({children}) => <p className={cn(RESPONSE_TEXT_CLASS, 'mb-3 last:mb-0')}>{children}</p>,
    strong: ({children}) => <strong className="font-semibold text-heading">{children}</strong>,
    em: ({children}) => <em className="italic text-heading">{children}</em>,
    del: ({children}) => <del className="text-muted line-through">{children}</del>,
    a: ({href, children}) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-heading underline decoration-border underline-offset-[3px] transition-opacity hover:opacity-75">
        {children}
      </a>
    ),
    hr: () => <hr className="my-5 border-0 border-t border-border" />,
    blockquote: ({children}) => (
      <blockquote className="my-4 border-l-[3px] border-heading/20 py-0.5 pl-4 text-[18px] leading-8 text-text italic">
        {children}
      </blockquote>
    ),
    ul: ({children}) => <ul className="assistant-list mb-4 space-y-3">{children}</ul>,
    ol: ({children}) => <ol className="assistant-list assistant-list-ordered mb-4 space-y-3">{children}</ol>,
    li: ({children, className}) => {
      const isTask = className?.includes('task-list-item');

      return (
        <li
          className={cn(
            'assistant-list-item flex items-start gap-3',
            RESPONSE_LIST_CLASS,
            isTask && 'gap-2.5',
            className,
          )}>
          {!isTask && <span aria-hidden="true" className="assistant-bullet mt-[13px]" />}
          <span className="min-w-0 flex-1 [&>p]:mb-0">{children}</span>
        </li>
      );
    },
    input: ({checked}) => (
      <input
        type="checkbox"
        checked={checked ?? false}
        readOnly
        className="mt-2 h-4 w-4 shrink-0 rounded border-border accent-heading"
      />
    ),
    code: ({className, children}) => {
      const isBlock = className?.includes('language-');
      if (isBlock) return <code className={className}>{children}</code>;
      return <code className="rounded-md bg-gray px-1.5 py-0.5 font-mono text-[15px] text-heading">{children}</code>;
    },
    pre: ({children}) => (
      <pre className="my-4 overflow-x-auto rounded-xl border border-border bg-gray p-4 font-mono text-[15px] leading-7 text-heading">
        {children}
      </pre>
    ),
    table: ({children}) => (
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[420px] border-collapse text-left text-[16px]">{children}</table>
      </div>
    ),
    thead: ({children}) => <thead className="border-b border-border bg-gray/70">{children}</thead>,
    th: ({children}) => (
      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted">{children}</th>
    ),
    td: ({children}) => <td className="border-t border-border px-4 py-2.5 text-heading">{children}</td>,
  };
}

export function AnimatedMarkdown({content, animate = true}: {content: string; animate?: boolean}) {
  const blocks = useMemo(() => content.split(/\n\n+/).filter(Boolean), [content]);
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : blocks.length);
  const components = useMemo(() => createStaticComponents(), []);

  useEffect(() => {
    if (!animate) {
      setVisibleCount(blocks.length);
      return;
    }

    setVisibleCount(0);
    if (blocks.length === 0) return;

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setVisibleCount(index);
      if (index >= blocks.length) clearInterval(timer);
    }, 550);

    return () => clearInterval(timer);
  }, [blocks, content, animate]);

  return (
    <div className="assistant-markdown max-w-2xl space-y-1">
      {blocks.slice(0, visibleCount).map((block, index) => (
        <motion.div
          key={`${index}-${block.slice(0, 20)}`}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
            {block}
          </ReactMarkdown>
        </motion.div>
      ))}
    </div>
  );
}

function stripInlineMarkdown(content: string) {
  return content.replace(/(\*\*|__|\*|_|`)/g, '');
}

function CharacterText({content, onAnimationComplete}: {content: string; onAnimationComplete?: () => void}) {
  return (
    <TextEffect as="span" per="char" preset="fade" speedReveal={3.5} speedSegment={2.2} onAnimationComplete={onAnimationComplete}>
      {stripInlineMarkdown(content)}
    </TextEffect>
  );
}

function AnimatedInlineText({content, onAnimationComplete}: {content: string; onAnimationComplete?: () => void}) {
  const segments = content.split(/(\*\*.+?\*\*|`.+?`|\*.+?\*)/g).filter(Boolean);

  return (
    <>
      {segments.map((segment, index) => {
        const isLastSegment = index === segments.length - 1;
        const complete = isLastSegment ? onAnimationComplete : undefined;
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return <strong key={`${index}-${segment}`} className="font-semibold text-heading"><CharacterText content={segment.slice(2, -2)} onAnimationComplete={complete} /></strong>;
        }
        if (segment.startsWith('*') && segment.endsWith('*')) {
          return <em key={`${index}-${segment}`} className="italic"><CharacterText content={segment.slice(1, -1)} onAnimationComplete={complete} /></em>;
        }
        if (segment.startsWith('`') && segment.endsWith('`')) {
          return <code key={`${index}-${segment}`} className="rounded-md bg-gray px-1.5 py-0.5 font-mono text-[15px] text-heading"><CharacterText content={segment.slice(1, -1)} onAnimationComplete={complete} /></code>;
        }
        return <CharacterText key={`${index}-${segment}`} content={segment} onAnimationComplete={complete} />;
      })}
    </>
  );
}

export function StreamingMarkdownLine({content, animate = true, onAnimationComplete}: {content: string; animate?: boolean; onAnimationComplete?: () => void}) {
  const components = useMemo(() => createStaticComponents(), []);
  const line = content.trim();

  if (!animate) {
    return (
      <div className="assistant-markdown [&_ol]:!mb-1 [&_p]:!mb-1 [&_ul]:!mb-1">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  if (line.startsWith('$$')) {
    return (
      <motion.div
        initial={{opacity: 0, y: 5}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.2, ease: 'easeOut'}}
        onAnimationComplete={onAnimationComplete}
        className="assistant-markdown my-3">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
          {`\n${line}\n`}
        </ReactMarkdown>
      </motion.div>
    );
  }

  const heading = line.match(/^(#{2,3})\s+(.+)$/);
  if (heading) {
    const [, level, headingText] = heading;
    if (level === '##') return <h2 className={RESPONSE_H2_CLASS}><AnimatedInlineText content={headingText} onAnimationComplete={onAnimationComplete} /></h2>;
    return <h3 className={RESPONSE_H3_CLASS}><AnimatedInlineText content={headingText} onAnimationComplete={onAnimationComplete} /></h3>;
  }

  const bullet = line.match(/^-\s+(.+)$/);
  if (bullet) {
    return (
      <ul className="assistant-list mb-1">
        <li className={cn('assistant-list-item flex items-start gap-3', RESPONSE_LIST_CLASS)}>
          <span aria-hidden="true" className="assistant-bullet mt-[13px]" />
          <span className="min-w-0 flex-1"><AnimatedInlineText content={bullet[1]} onAnimationComplete={onAnimationComplete} /></span>
        </li>
      </ul>
    );
  }

  const numbered = line.match(/^(\d+)\.\s+(.+)$/);
  if (numbered) {
    return (
      <ol className="assistant-list assistant-list-ordered mb-1">
        <li className={cn('assistant-list-item flex items-start gap-3', RESPONSE_LIST_CLASS)}>
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray text-xs font-semibold text-heading">{numbered[1]}</span>
          <span className="min-w-0 flex-1"><AnimatedInlineText content={numbered[2]} onAnimationComplete={onAnimationComplete} /></span>
        </li>
      </ol>
    );
  }

  if (line.startsWith('> ')) {
    return (
      <blockquote className="my-2 border-l-[3px] border-heading/20 py-0.5 pl-4 text-[18px] leading-8 text-text italic">
        <AnimatedInlineText content={line.slice(2)} onAnimationComplete={onAnimationComplete} />
      </blockquote>
    );
  }

  return (
    <p className={cn(RESPONSE_TEXT_CLASS, 'mb-1')}><AnimatedInlineText content={line} onAnimationComplete={onAnimationComplete} /></p>
  );
}
