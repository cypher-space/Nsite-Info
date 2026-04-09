<script setup>
useSeoMeta({
  title: 'Gateways',
  description: 'Full Nsite gateway table with support matrix, npub visit links, and maintained gateway repos.'
})

const fallbackData = {
  updatedAt: '',
  contribution: {
    message: 'Hey! If you run a gateway, commit your URL and support matrix to this file.',
    file: 'public/gateways.json'
  },
  gateways: [],
  repos: []
}

const { data: gatewayData } = await useFetch('/gateways.json', {
  default: () => fallbackData,
  server: false
})

const npubInput = ref('')

const cleanNpub = computed(() => String(npubInput.value || '').trim())
const gateways = computed(() => gatewayData.value?.gateways || [])
const repos = computed(() => {
  return (gatewayData.value?.repos || []).filter((repo) => {
    const kind = String(repo.kind || '').toLowerCase()
    return repo.maintained && kind.includes('gateway')
  })
})

const buildVisitUrl = (gateway) => {
  if (!cleanNpub.value) {
    return gateway.url
  }

  return `https://${cleanNpub.value}.${gateway.host}`
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="surface rounded-[2rem] border border-[var(--color-line)] p-8 sm:p-10">
        <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Gateways</div>
        <h1 class="mt-4 text-5xl font-semibold leading-[0.95] text-[var(--color-fg)] sm:text-6xl">
          Full gateway list and support matrix.
        </h1>
        <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--color-soft)] sm:text-lg">
          Input an npub and each Visit button will open that pubkey on the selected gateway. Hey! If you run a gateway, submit your URL and support matrix in
          <a
            href="https://github.com/S7NC/Nsite-Info/blob/main/public/gateways.json"
            target="_blank"
            rel="noreferrer"
          >
            this repo's `public/gateways.json`
          </a>.
        </p>

        <div class="mt-6 grid gap-4 lg:grid-cols-[0.8fr_0.2fr]">
          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Input Npub</span>
            <input
              v-model="npubInput"
              type="text"
              placeholder="npub1..."
              class="w-full rounded-[1.2rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-fg)]"
            >
          </label>

          <div class="self-end rounded-[1.2rem] border border-[var(--color-line)] px-4 py-3 text-sm text-[var(--color-soft)]">
            <div><strong class="text-[var(--color-fg)]">Updated:</strong> {{ gatewayData?.updatedAt || 'Unknown' }}</div>
          </div>
        </div>
      </section>

      <section class="surface mt-6 rounded-[1.75rem] border border-[var(--color-line)] p-6 sm:p-8">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[780px] border-collapse text-sm">
            <thead>
              <tr class="border-b border-[var(--color-line)] text-left text-[var(--color-soft)]">
                <th class="px-3 py-3 font-semibold">Gateway</th>
                <th class="px-3 py-3 font-semibold">Type</th>
                <th class="px-3 py-3 text-center font-semibold">Nsite</th>
                <th class="px-3 py-3 text-center font-semibold">Napps</th>
                <th class="px-3 py-3 text-center font-semibold">Napplets</th>
                <th class="px-3 py-3 font-semibold">Visit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gateway in gateways" :key="gateway.host" class="border-b border-[var(--color-line)] last:border-b-0">
                <td class="px-3 py-4 align-top">
                  <div class="font-semibold text-[var(--color-fg)]">{{ gateway.name }}</div>
                  <div class="mt-1 text-xs text-[var(--color-soft)]">{{ gateway.notes }}</div>
                </td>
                <td class="px-3 py-4 align-top">
                  <span class="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs font-semibold text-[var(--color-soft)]">{{ gateway.type || gateway.status }}</span>
                </td>
                <td class="px-3 py-4 text-center align-top">
                  <span class="support-pill" :class="gateway.supports?.nsite ? 'support-yes' : 'support-no'">
                    {{ gateway.supports?.nsite ? '✓' : '—' }}
                  </span>
                </td>
                <td class="px-3 py-4 text-center align-top">
                  <span class="support-pill" :class="gateway.supports?.napps ? 'support-yes' : 'support-no'">
                    {{ gateway.supports?.napps ? '✓' : '—' }}
                  </span>
                </td>
                <td class="px-3 py-4 text-center align-top">
                  <span class="support-pill" :class="gateway.supports?.napplets ? 'support-yes' : 'support-no'">
                    {{ gateway.supports?.napplets ? '✓' : '—' }}
                  </span>
                </td>
                <td class="px-3 py-4 align-top">
                  <a
                    :href="buildVisitUrl(gateway)"
                    target="_blank"
                    rel="noreferrer"
                    class="visit-button inline-flex rounded-full px-4 py-2 text-xs font-semibold no-underline"
                  >
                    Visit
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="surface mt-6 rounded-[1.75rem] border border-[var(--color-line)] p-8">
        <h2 class="text-3xl font-semibold text-[var(--color-fg)]">Most used and maintained gateway repos</h2>
        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="repo in repos"
            :key="repo.url"
            :href="repo.url"
            target="_blank"
            rel="noreferrer"
            class="rounded-[1rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 no-underline transition hover:-translate-y-0.5 hover:border-[var(--color-fg)]"
          >
            <div class="font-semibold text-[var(--color-fg)]">{{ repo.name }}</div>
            <div class="mt-1 text-xs text-[var(--color-soft)]">{{ repo.kind }}</div>
          </a>
        </div>
      </section>

    </main>

    <Footer />
  </div>
</template>

<style scoped>
.visit-button {
  border: 1px solid var(--color-fg);
  background: var(--color-fg);
  color: var(--color-bg) !important;
}

.support-pill {
  display: inline-flex;
  min-width: 1.65rem;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--color-line);
  padding: 0.12rem 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.support-yes {
  border-color: #16a34a;
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.support-no {
  color: var(--color-soft);
}
</style>
