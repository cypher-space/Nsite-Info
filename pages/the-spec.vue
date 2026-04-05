<script setup>
useSeoMeta({
  title: 'The Spec',
  description: 'Nsite specification notes focused on NIP-5A, manifests, relay hints, and blossom hints.'
})

const specPoints = [
  'Root sites resolve from kind 15128 manifests.',
  'Named sites resolve from kind 35128 manifests and d tags.',
  'Relay hints come from kind 10002 and manifest relay tags.',
  'Blossom server hints come from kind 10063 and manifest server tags.',
  'Legacy content may still appear in kind 34128 events.'
]
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="surface rounded-[2rem] border border-[var(--color-line)] p-8 sm:p-10">
        <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">The Spec</div>
        <h1 class="mt-4 text-5xl font-semibold leading-[0.95] text-[var(--color-fg)] sm:text-6xl">
          Nsite resolution in plain language.
        </h1>
        <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--color-soft)] sm:text-lg">
          This page summarizes the implementation shape from NIP-5A so operators and builders can debug behavior without reading protocol prose every time.
        </p>
      </section>

      <section class="mt-6 grid gap-4">
        <article v-for="point in specPoints" :key="point" class="surface rounded-[1.5rem] border border-[var(--color-line)] p-6 text-sm leading-7 text-[var(--color-fg)]">
          {{ point }}
        </article>
      </section>

      <section class="surface mt-6 rounded-[1.75rem] border border-[var(--color-line)] p-8">
        <h2 class="text-3xl font-semibold text-[var(--color-fg)]">Debug in context</h2>
        <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">
          Use the debugger to test one pubkey at a time against live relay data, then use examples to compare behavior across real deployed sites.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/debug" class="spec-primary rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition hover:opacity-85">Open debug</NuxtLink>
          <NuxtLink to="/examples" class="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-semibold no-underline transition hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]">Browse examples</NuxtLink>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.spec-primary {
  border: 1px solid var(--color-fg);
  background: var(--color-fg);
  color: var(--color-bg) !important;
}
</style>
