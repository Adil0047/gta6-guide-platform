import { ArrowRight, BookOpen, Map, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import { BlurIn, FadeIn, ScaleIn } from '@/components/animations';
import { SearchForm } from '@/components/forms';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-32">
      {/* Cinematic hero background — Ken Burns slow zoom keeps it alive */}
      <div className="pointer-events-none absolute inset-0 -z-30 overflow-hidden">
        <img
          src="/images/hero-banner.jpg"
          alt=""
          aria-hidden="true"
          width={1344}
          height={768}
          fetchPriority="high"
          decoding="async"
          className="ken-burns h-full w-full object-cover object-center"
        />
      </div>

      {/* Darkening layer — keeps text readable without killing the image */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-black/45" />

      {/* Cinematic gradient mesh overlay — pink/cyan/purple atmospheric depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(circle at 18% 30%, rgba(255,60,172,0.22), transparent 45%), radial-gradient(circle at 82% 20%, rgba(0,229,255,0.18), transparent 42%), radial-gradient(circle at 50% 90%, rgba(124,58,237,0.16), transparent 50%)',
        }}
      />

      {/* Scanline accent — thin neon line that reads as "game UI" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 -z-10 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent neon-pulse"
      />

      {/* Bottom fade into the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />

      {/* Subtle side vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Floating decorative orbs — drift gently for a living, vibrant feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-neon-pink/10 blur-3xl float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-neon-cyan/10 blur-3xl float-slower"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 -z-10 h-[24rem] w-[24rem] rounded-full bg-neon-purple/10 blur-3xl float-slow"
      />

      <Container className="relative">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <FadeIn>
            <Badge variant="pink" className="mx-auto glow-pulse-pink">
              <Sparkles aria-hidden className="mr-2 size-3.5" />
              Premium GTA VI intelligence hub
            </Badge>
          </FadeIn>

          {/* Main heading — display font + animated gradient + blur-in entrance */}
          <BlurIn delay={0.1}>
            <h1 className="font-display mt-7 text-balance text-5xl font-black tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
              Everything you need to
              <br />
              <span className="animated-gradient-text bg-gradient-to-r from-neon-pink via-white to-neon-cyan bg-clip-text text-transparent text-glow-pink">
                conquer GTA VI.
              </span>
            </h1>
          </BlurIn>

          {/* Description */}
          <FadeIn delay={0.24}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-white/85 drop-shadow-lg sm:text-lg">
              Missions, secrets, maps, money, routes, and everything in between.
              <br className="hidden sm:block" />
              Find what you need fast, learn the game, and get back to playing.
            </p>
          </FadeIn>

          {/* Search */}
          <FadeIn delay={0.32}>
            <div className="mx-auto mt-9 max-w-3xl rounded-panel border border-white/15 bg-black/30 p-3 shadow-panel backdrop-blur-md">
              <SearchForm />
            </div>
          </FadeIn>

          {/* CTA buttons — primary uses the neon gradient variant */}
          <FadeIn delay={0.4}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={ROUTES.guides}>
                <Button variant="neon">
                  <span className="text-white">Explore guides</span>
                  <ArrowRight aria-hidden className="ml-2 size-4" />
                </Button>
              </Link>

              <Link
                to={ROUTES.map}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-black/25 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-neon-cyan/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View map system
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Feature cards — stat strip with shimmer-on-hover + accent banners */}
        <ScaleIn delay={0.5}>
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
            <Link
              to={ROUTES.guides}
              className="shimmer-on-hover group relative overflow-hidden rounded-card border border-white/10 bg-black/25 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-neon-pink/40 hover:bg-white/[0.06]"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
              <span className="grid size-11 place-items-center rounded-2xl border border-neon-pink/20 bg-neon-pink/10 text-neon-pink">
                <BookOpen aria-hidden className="size-6" />
              </span>
              <p className="mt-4 text-2xl font-black text-white">80+</p>
              <p className="mt-1 text-sm text-white/70">Guide-ready content modules</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-neon-pink opacity-0 transition group-hover:opacity-100">
                Browse guides
                <ArrowRight aria-hidden className="size-3" />
              </span>
            </Link>

            <Link
              to={ROUTES.search}
              className="shimmer-on-hover group relative overflow-hidden rounded-card border border-white/10 bg-black/25 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-neon-cyan/40 hover:bg-white/[0.06]"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
              <span className="grid size-11 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
                <Search aria-hidden className="size-6" />
              </span>
              <p className="mt-4 text-2xl font-black text-white">Fast</p>
              <p className="mt-1 text-sm text-white/70">Search-first discovery system</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-neon-cyan opacity-0 transition group-hover:opacity-100">
                Start searching
                <ArrowRight aria-hidden className="size-3" />
              </span>
            </Link>

            <Link
              to={ROUTES.map}
              className="shimmer-on-hover group relative overflow-hidden rounded-card border border-white/10 bg-black/25 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-neon-purple/40 hover:bg-white/[0.06]"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
              <span className="grid size-11 place-items-center rounded-2xl border border-neon-purple/20 bg-neon-purple/10 text-neon-purple">
                <Map aria-hidden className="size-6" />
              </span>
              <p className="mt-4 text-2xl font-black text-white">Map</p>
              <p className="mt-1 text-sm text-white/70">Interactive location architecture</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-neon-purple opacity-0 transition group-hover:opacity-100">
                Open map
                <ArrowRight aria-hidden className="size-3" />
              </span>
            </Link>
          </div>
        </ScaleIn>
      </Container>
    </section>
  );
}
