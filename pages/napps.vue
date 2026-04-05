<script setup>
useSeoMeta({
  title: 'Napps',
  description: 'Framing for Napps: all Napps are Nsites, with additional application-level capabilities.'
})

const powers = [
  'Cloneability into your own sovereign space.',
  'Gateway redundancy when one resolver is down.',
  'Potential distribution patterns similar to app stores.',
  'Multiple named sites can act like a personal app store catalog.'
]

const definition = [
  'Cloneability: resolving through subdomain or author.',
  'Key login and/or signing flows (NIP-07 or remote signing in practice).'
]
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="hero-banner rounded-[2rem] border border-[var(--hero-line)] p-8 sm:p-10">
        <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--hero-soft)]">Napps</div>
        <h1 class="hero-title mt-4 text-5xl font-semibold leading-[0.95] sm:text-6xl">
          All Napps are Nsites, but not all Nsites are Napps.
        </h1>
        <p class="hero-copy mt-5 max-w-3xl text-base leading-8 sm:text-lg">
          Napps are Nsites with extra practical powers. The goal is portable client behavior across gateways and operators, not just static hosting.
        </p>
      </section>

      <section class="mt-6 grid gap-6 lg:grid-cols-2">
        <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-8">
          <h2 class="text-3xl font-semibold text-[var(--color-fg)]">Super powers</h2>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-[var(--color-soft)]">
            <li v-for="item in powers" :key="item">- {{ item }}</li>
          </ul>
        </article>

        <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-8">
          <h2 class="text-3xl font-semibold text-[var(--color-fg)]">Working definition</h2>
          <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">
            A Nostr client deployed as an Nsite that supports at least 2/3 of core Napp capabilities.
          </p>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-[var(--color-soft)]">
            <li v-for="item in definition" :key="item">- {{ item }}</li>
          </ul>
        </article>
      </section>

      <section class="surface mt-6 rounded-[1.75rem] border border-[var(--color-line)] p-8">
        <h2 class="text-3xl font-semibold text-[var(--color-fg)]">Personal app store model</h2>
        <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">
          A single pubkey can publish multiple named sites and use them as a personal app-store style catalog. Each named site can represent one app, one version channel, or one feature branch while staying under the same publisher identity.
        </p>
        <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">
          There is only one root app per pubkey (the root `15128` site). Treat that root as the canonical entrypoint, then branch into additional named `35128` sites for the rest of the app collection.
        </p>
      </section>

      <section class="surface mt-6 rounded-[1.75rem] border border-[var(--color-line)] p-8">
        <h2 class="text-3xl font-semibold text-[var(--color-fg)]">Open questions</h2>
        <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">
          Carbon copy behavior, auto-update semantics, and manifest-driven inject/resolve patterns are still evolving. The debugger and examples pages are built to test those assumptions in public.
        </p>
      </section>
    </main>

    <Footer />
  </div>
</template>
