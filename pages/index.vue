<script setup>
useSeoMeta({
  title: 'Nsite Info',
  description: 'General Nsite specification and gateway information with practical tools for inspection.'
})

const primaryLinks = [
  { label: 'Read The Spec', to: '/the-spec' },
  { label: 'Gateway Directory', to: '/gateways' },
  { label: 'Napps Overview', to: '/napps' },
  { label: 'Open Debug', to: '/debug' }
]

const featureCards = [
  {
    title: 'Protocol Basics',
    body: 'Covers NIP-5A resolution model, site manifests, relay hints, blossom hints, and legacy compatibility.'
  },
  {
    title: 'Gateway Matrix',
    body: 'Maintains a living list of community gateways, support coverage, and direct links generated from your npub.'
  },
  {
    title: 'Practical Tools',
    body: 'Includes a debugger and examples browser so you can inspect real deployments while reading the spec.'
  }
]

const infoPoints = [
  'Root and named site resolution flows with clear event-kind mapping.',
  'Gateway behavior references for operators and client builders.',
  'Napps framing with cloneability and signing expectations.',
  'Live examples sourced from relay scans for practical validation.'
]

const resourceLinks = [
  {
    label: 'NIP-5A: Static Websites',
    href: 'https://github.com/nostr-protocol/nips/blob/master/5A.md'
  },
  {
    label: 'Awesome Nsite',
    href: 'https://github.com/nostrver-se/awesome-nsite'
  },
  {
    label: 'Nsite Gateway Repo',
    href: 'https://github.com/hzrd149/nsite-gateway'
  },
  {
    label: 'nsite.run Repo',
    href: 'https://github.com/sandwichfarm/nsite.run'
  }
]
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="hero-banner rounded-[2rem] border border-[var(--hero-line)] p-8 sm:p-10">
        <div class="max-w-4xl">
          <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--hero-soft)]">Nsite.info</div>
          <h1 class="hero-title mt-5 text-5xl font-semibold leading-[0.93] sm:text-7xl">
            A practical reference for the Nsite ecosystem.
          </h1>
          <p class="hero-copy mt-6 max-w-3xl text-base leading-8 sm:text-lg">
            This homepage is focused on general specification guidance and useful links so you can understand how Nsites resolve, how gateways behave, and where to find maintained tooling.
          </p>
        </div>

        <div class="mt-10 flex flex-wrap gap-3">
          <NuxtLink
            v-for="link in primaryLinks"
            :key="link.to"
            :to="link.to"
            class="hero-action rounded-full px-6 py-3 text-sm font-semibold no-underline"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </section>

      <section class="mt-6 grid gap-4 lg:grid-cols-3">
        <article
          v-for="card in featureCards"
          :key="card.title"
          class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6"
        >
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-soft)]">{{ card.title }}</div>
          <p class="mt-4 text-sm leading-7 text-[var(--color-fg)]">{{ card.body }}</p>
        </article>
      </section>

      <section class="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-8">
          <h2 class="text-4xl font-semibold text-[var(--color-fg)]">What you get here</h2>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-[var(--color-soft)]">
            <li v-for="point in infoPoints" :key="point">- {{ point }}</li>
          </ul>
        </article>

        <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-8">
          <h2 class="text-4xl font-semibold text-[var(--color-fg)]">Reference links</h2>
          <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">
            Start with the spec and gateway/tooling repos below for a complete picture.
          </p>
          <div class="mt-5 grid gap-3">
            <a
              v-for="resource in resourceLinks"
              :key="resource.href"
              :href="resource.href"
              target="_blank"
              rel="noreferrer"
              class="rounded-[1rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 text-sm text-[var(--color-fg)] no-underline transition hover:-translate-y-0.5 hover:border-[var(--color-fg)]"
            >
              {{ resource.label }}
            </a>
          </div>
        </article>
      </section>
    </main>

    <Footer />
  </div>
</template>
