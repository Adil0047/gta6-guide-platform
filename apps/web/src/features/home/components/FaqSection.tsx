import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Container } from '@/components/ui/Container';
import { faqs } from '@/data';
import { cn } from '@/utils/cn';

export function FaqSection() {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? '');

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan">FAQ</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Built like a product, not a basic gaming blog.
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((faq) => {
            const isOpen = faq.id === openId;

            return (
              <div
                key={faq.id}
                className="rounded-card border border-white/10 bg-white/[0.04] backdrop-blur-xl"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setOpenId(isOpen ? '' : faq.id);
                  }}
                >
                  <span className="text-base font-bold text-white">{faq.question}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'size-5 shrink-0 text-neon-cyan transition',
                      isOpen ? 'rotate-180' : '',
                    )}
                  />
                </button>

                {isOpen ? (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-7 text-text-secondary">{faq.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
