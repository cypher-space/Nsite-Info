<script setup>
const { DEFAULT_RELAYS, exploreSites } = useNsiteDebug()

useSeoMeta({
  title: 'Nsite Examples',
  description: 'Discover live Nsite examples across major relays and open them in public gateways.'
})

const relayInput = ref(DEFAULT_RELAYS.join('\n'))
const loading = ref(false)
const error = ref('')
const explorer = ref(null)
const search = ref('')

const formatDate = (timestamp) => timestamp ? new Date(timestamp * 1000).toLocaleString() : 'Unknown'
const shortValue = (value = '', size = 16) => value && value.length > size * 2 ? `${value.slice(0, size)}...${value.slice(-size)}` : value
const uploaderLabel = (site) => site.uploader?.name || shortValue(site.npub, 9)

const filteredSites = computed(() => {
  const sites = (explorer.value?.sites || []).filter((site) => {
    const name = String(site.uploader?.name || '').trim().toLowerCase()
    const hasProfile = Boolean(site.uploader?.name && site.uploader?.picture)
    const isExcludedName = name === '44 mirror'

    return hasProfile && !isExcludedName
  })

  const term = search.value.trim().toLowerCase()

  if (!term) {
    return sites
  }

  return sites.filter((site) => [site.title, site.identifier, site.npub, site.pubkey, site.uploader?.name, site.uploader?.nip05]
    .some((field) => String(field || '').toLowerCase().includes(term)))
})

const loadSites = async () => {
  loading.value = true
  error.value = ''

  try {
    explorer.value = await exploreSites({ relays: relayInput.value, limit: 250 })
  } catch (loadError) {
    error.value = loadError.message || 'Failed to scan relays for examples.'
    explorer.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadSites)
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="surface rounded-[2rem] border border-[var(--color-line)] p-8 sm:p-10">
          <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Examples</div>
          <h1 class="mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] text-[var(--color-fg)] sm:text-6xl">
            Browse live Nsite examples.
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-8 text-[var(--color-soft)]">
            This scans Damus, nos.lol, Primal, and Ditto for root and named manifests. Use this as a living example catalog and jump into gateways directly.
          </p>
        </div>

        <div class="ink-panel rounded-[2rem] border border-[var(--color-line)] p-8 sm:p-10">
          <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Snapshot</div>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="ink-panel-line rounded-[1.25rem] border px-4 py-4">
              <div class="text-3xl font-semibold">{{ explorer?.counts.total || 0 }}</div>
              <div class="ink-panel-soft mt-1 text-xs uppercase tracking-[0.2em]">Total</div>
            </div>
            <div class="ink-panel-line rounded-[1.25rem] border px-4 py-4">
              <div class="text-3xl font-semibold">{{ explorer?.counts.root || 0 }}</div>
              <div class="ink-panel-soft mt-1 text-xs uppercase tracking-[0.2em]">Root</div>
            </div>
            <div class="ink-panel-line rounded-[1.25rem] border px-4 py-4">
              <div class="text-3xl font-semibold">{{ explorer?.counts.named || 0 }}</div>
              <div class="ink-panel-soft mt-1 text-xs uppercase tracking-[0.2em]">Named</div>
            </div>
          </div>
          <p class="ink-panel-soft mt-4 text-xs leading-6">
            Showing only profiles with both `name` and `picture` in kind 0 metadata.
          </p>
        </div>
      </section>

      <section class="surface mt-6 rounded-[2rem] border border-[var(--color-line)] p-6 sm:p-8">
        <div class="grid gap-5 lg:grid-cols-[0.8fr_0.2fr]">
          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Relays to scan</span>
            <textarea v-model="relayInput" rows="4" class="w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 outline-none transition focus:border-[var(--color-fg)]" />
          </label>

          <div class="flex items-end">
            <button type="button" class="w-full rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-85 disabled:opacity-60" :disabled="loading" @click="loadSites">
              {{ loading ? 'Scanning...' : 'Scan relays' }}
            </button>
          </div>
        </div>

        <div class="mt-6">
          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Filter examples</span>
            <input v-model="search" type="text" placeholder="Search by uploader name, nip05, npub, or title" class="w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 outline-none transition focus:border-[var(--color-fg)]">
          </label>
        </div>

        <div v-if="error" class="mt-6 rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 text-sm text-[var(--color-fg)]">
          {{ error }}
        </div>
      </section>

      <section class="mt-6">
        <div v-if="!loading && !filteredSites.length" class="surface rounded-[2rem] border border-[var(--color-line)] p-10 text-center">
          <h2 class="text-3xl font-semibold text-[var(--color-fg)]">No examples found</h2>
          <p class="mt-3 text-sm leading-7 text-[var(--color-soft)]">Try a broader relay mix or remove the filter. Profiles must include both `name` and `picture`.</p>
        </div>

        <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article v-for="site in filteredSites" :key="site.id" class="surface rounded-[1.25rem] border border-[var(--color-line)] p-4 transition hover:-translate-y-1 hover:border-[var(--color-fg)]">
            <div class="flex items-center gap-3">
              <img
                :src="site.uploader.picture"
                alt="Uploader profile picture"
                class="h-11 w-11 rounded-full border border-[var(--color-line)] object-cover"
                loading="lazy"
              >
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold text-[var(--color-fg)]">{{ uploaderLabel(site) }}</div>
                <div class="truncate text-xs text-[var(--color-soft)]">{{ site.uploader?.nip05 || site.npub }}</div>
              </div>
            </div>

            <div class="mt-3 text-xs text-[var(--color-soft)]">
              {{ site.identifier ? `/${site.identifier}` : 'root' }} · {{ formatDate(site.updatedAt) }}
            </div>

            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              <a :href="site.links[0].rootSiteUrl" target="_blank" rel="noreferrer" class="rounded-full border border-[var(--color-line)] px-3 py-1.5 no-underline transition hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]">Visit nsite.lol</a>
              <a :href="site.links[1].rootSiteUrl" target="_blank" rel="noreferrer" class="rounded-full border border-[var(--color-line)] px-3 py-1.5 no-underline transition hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]">Visit nsite.run</a>
            </div>
          </article>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>
