<script setup>
const links = [
  { label: 'nsite.lol', href: 'https://nsite.lol' },
  { label: 'nsite.run', href: 'https://nsite.run' },
  { label: 'NIP-5A', href: 'https://github.com/nostr-protocol/nips/blob/master/5A.md' }
]
</script>

<template>
  <footer class="mx-auto mt-16 max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
    <div class="grid gap-6 border-t border-[var(--color-line)] py-8 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Nsite Info</div>
        <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--color-soft)]">
          Query-first tools for inspecting Nsite manifests, relay propagation, blossom hints, and public gateway resolution.
        </p>
      </div>

      <div class="flex flex-wrap gap-3 text-sm">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noreferrer"
          class="rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-4 py-2 no-underline transition hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </footer>
</template>
