import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { Container } from '@/components/ui/Container';
import { RevealOnScroll } from '@/components/animations';
import { faqs } from '@/data';
import { cn } from '@/utils/cn';

export function FaqSection() {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? '');
  const shouldReduceMotion = useReducedMotion();

  return (
    <RevealOnScroll>
      <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan">FAQ</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Built like a product, not a basic gaming blog.
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = faq.id === openId;

            return (
              <div
                key={faq.id}
                className={cn(
                  'overflow-hidden rounded-card border bg-white/[0.04] backdrop-blur-xl transition',
                  isOpen ? 'border-neon-cyan/30' : 'border-white/10 hover:border-white/20',
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                  id={`faq-trigger-${faq.id}`}
                  onClick={() => {
                    setOpenId(isOpen ? '' : faq.id);
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'grid size-7 shrink-0 place-items-center rounded-lg border text-[11px] font-bold transition',
                        isOpen
                          ? 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan'
                          : 'border-white/10 bg-white/[0.04] text-text-muted',
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-bold text-white">{faq.question}</span>
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'size-5 shrink-0 text-neon-cyan transition-transform duration-300',
                      isOpen ? 'rotate-180' : '',
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key={`faq-panel-${faq.id}`}
                      id={`faq-panel-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${faq.id}`}
                      initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={shouldReduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 px-5 py-5 pl-16">
                        <p className="text-sm leading-7 text-text-secondary">{faq.answer}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
      </section>
    </RevealOnScroll>
  );
}
