<script setup>
useSeoMeta({
  title: 'Nsite Info',
  description: 'Nsite spec notes, gateway links, and Napp framing with debugger and explorer tools.'
})

const gatewayLinks = [
  { label: 'nsite.lol', href: 'https://nsite.lol' },
  { label: 'nsite.run', href: 'https://nsite.run' }
]

const featureCards = [
  {
    title: 'The Spec',
    body: 'NIP-5A anchors root and named Nsite resolution through kinds 15128 and 35128 with relay and blossom hints.'
  },
  {
    title: 'Gateways',
    body: 'Gateway redundancy matters. If one gateway is down, the same site should still be reachable through another.'
  },
  {
    title: 'Napps',
    body: 'All Napps are Nsites, but not all Nsites are Napps. Napps add practical app-level powers on top of site hosting.'
  }
]

const nappPowers = [
  'Cloneability to your own sovereign space.',
  'Gateway redundancy across multiple resolvers.',
  'Potential distribution through app-store style catalogs.'
]

const definitionChecks = [
  'Cloneability (resolving through subdomain or author).',
  'Key login and/or signing functions (closer to NIP-07 or remote signing).'
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
            Hear ye, hear ye.
          </h1>
          <p class="hero-copy mt-6 max-w-3xl text-base leading-8 sm:text-lg">
            All Napps are Nsites, but not all Nsites are Napps.
          </p>
          <p class="hero-copy mt-4 max-w-3xl text-base leading-8 sm:text-lg">
            Carbon copy, auto-update, or manifest-driven inject/resolve flows are exactly the kind of questions this project should make easier to test.
          </p>
        </div>

        <div class="mt-10 flex flex-wrap gap-3">
          <NuxtLink to="/debug" class="hero-action rounded-full px-6 py-3 text-sm font-semibold no-underline">
            Open debugger
          </NuxtLink>
          <NuxtLink to="/examples" class="hero-action rounded-full px-6 py-3 text-sm font-semibold no-underline">
            Open examples
          </NuxtLink>
          <a v-for="gateway in gatewayLinks" :key="gateway.href" :href="gateway.href" target="_blank" rel="noreferrer" class="hero-action rounded-full px-6 py-3 text-sm font-semibold no-underline">
            {{ gateway.label }}
          </a>
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
          <h2 class="text-4xl font-semibold text-[var(--color-fg)]">Napps and super powers</h2>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-[var(--color-soft)]">
            <li v-for="power in nappPowers" :key="power">- {{ power }}</li>
          </ul>
        </article>

        <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-8">
          <h2 class="text-4xl font-semibold text-[var(--color-fg)]">What is my definition?</h2>
          <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">
            A Nostr client deployed as an Nsite and supporting at least 2/3 of the capabilities below.
          </p>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-[var(--color-soft)]">
            <li v-for="check in definitionChecks" :key="check">- {{ check }}</li>
          </ul>
        </article>
      </section>
    </main>

    <Footer />
  </div>
</template>
