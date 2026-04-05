<script setup>
useSeoMeta({
  title: 'Gateways',
  description: 'Gateway notes for Nsite redundancy, canonical URL patterns, and operational checks.'
})

const gatewayCards = [
  {
    name: 'nsite.lol',
    href: 'https://nsite.lol',
    note: 'Public gateway and index surface for many deployed sites.'
  },
  {
    name: 'nsite.run',
    href: 'https://nsite.run',
    note: 'Public gateway plus richer operational tooling around Nsite publishing.'
  }
]

const checks = [
  'If one gateway is down, verify the same site on another gateway.',
  'Validate both root and named-site URL behavior.',
  'Confirm path and content hash resolution matches manifest data.',
  'Compare behavior against relay and blossom availability.'
]
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="surface rounded-[2rem] border border-[var(--color-line)] p-8 sm:p-10">
        <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Gateways</div>
        <h1 class="mt-4 text-5xl font-semibold leading-[0.95] text-[var(--color-fg)] sm:text-6xl">
          Gateway redundancy is a feature, not a fallback.
        </h1>
        <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--color-soft)] sm:text-lg">
          If one resolver fails, the same Nsite should still be reachable elsewhere. This page keeps those gateway checks explicit.
        </p>
      </section>

      <section class="mt-6 grid gap-4 lg:grid-cols-2">
        <a
          v-for="gateway in gatewayCards"
          :key="gateway.href"
          :href="gateway.href"
          target="_blank"
          rel="noreferrer"
          class="surface rounded-[1.75rem] border border-[var(--color-line)] p-7 no-underline transition hover:-translate-y-1 hover:border-[var(--color-fg)]"
        >
          <div class="text-3xl font-semibold text-[var(--color-fg)]">{{ gateway.name }}</div>
          <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">{{ gateway.note }}</p>
        </a>
      </section>

      <section class="surface mt-6 rounded-[1.75rem] border border-[var(--color-line)] p-8">
        <h2 class="text-3xl font-semibold text-[var(--color-fg)]">Operator checklist</h2>
        <ul class="mt-5 space-y-3 text-sm leading-7 text-[var(--color-soft)]">
          <li v-for="item in checks" :key="item">- {{ item }}</li>
        </ul>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/debug" class="operator-primary rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition hover:opacity-85">Run checks in debug</NuxtLink>
          <NuxtLink to="/examples" class="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-semibold no-underline transition hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]">Compare live examples</NuxtLink>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.operator-primary {
  border: 1px solid var(--color-fg);
  background: var(--color-fg);
  color: var(--color-bg) !important;
}
</style>
