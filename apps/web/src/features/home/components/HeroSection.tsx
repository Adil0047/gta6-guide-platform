import { ArrowRight, BookOpen, Map, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import { FadeIn, ScaleIn } from '@/components/animations';
import { SearchForm } from '@/components/forms';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-neon-pink/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-[26rem] w-[26rem] rounded-full bg-neon-cyan/10 blur-3xl" />

      <Container className="relative">
        <div className="mx-auto max-w-5xl text-center">
          <FadeIn>
            <Badge variant="pink" className="mx-auto">
              <Sparkles aria-hidden className="mr-2 size-3.5" />
              Premium GTA VI intelligence hub
            </Badge>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="mt-8 text-balance text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Master every mission, map route, secret, and upgrade in{' '}
              <span className="bg-gradient-to-r from-neon-pink via-white to-neon-cyan bg-clip-text text-transparent">
                GTA VI
              </span>
              .
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mx-auto mt-7 max-w-3xl text-pretty text-base leading-8 text-text-secondary sm:text-lg">
              A fast, cinematic, SEO-ready guide platform built for walkthroughs, categories,
              search, dashboards, bookmarks, map tools, and future AI-powered gameplay assistance.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="mx-auto mt-10 max-w-3xl rounded-panel border border-white/10 bg-white/[0.04] p-3 shadow-panel backdrop-blur-xl">
              <SearchForm />
            </div>
          </FadeIn>

          <FadeIn delay={0.32}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={ROUTES.guides}>
                <Button>
                  Explore guides
                  <ArrowRight aria-hidden className="ml-2 size-4" />
                </Button>
              </Link>
              <Link
                to={ROUTES.map}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:border-neon-cyan/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View map system
              </Link>
            </div>
          </FadeIn>
        </div>

        <ScaleIn delay={0.42}>
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
            <div className="rounded-card border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <BookOpen aria-hidden className="size-6 text-neon-pink" />
              <p className="mt-4 text-2xl font-black text-white">80+</p>
              <p className="mt-1 text-sm text-text-secondary">Guide-ready content modules</p>
            </div>
            <div className="rounded-card border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <Search aria-hidden className="size-6 text-neon-cyan" />
              <p className="mt-4 text-2xl font-black text-white">Fast</p>
              <p className="mt-1 text-sm text-text-secondary">Search-first discovery system</p>
            </div>
            <div className="rounded-card border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <Map aria-hidden className="size-6 text-neon-purple" />
              <p className="mt-4 text-2xl font-black text-white">Map</p>
              <p className="mt-1 text-sm text-text-secondary">Interactive location architecture</p>
            </div>
          </div>
        </ScaleIn>
      </Container>
    </section>
  );
}
