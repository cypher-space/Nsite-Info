<script setup>
const {
  DEFAULT_RELAYS,
  DEFAULT_BLOSSOMS,
  isValidNamedSiteIdentifier,
  inspectSite
} = useNsiteDebug()

const route = useRoute()

useSeoMeta({
  title: 'Nsite Debugger',
  description: 'Inspect NIP-5A manifests, relay lists, blossom hints, legacy files, and gateway links for deployed Nsites.'
})

const form = reactive({
  pubkeyInput: '',
  identifier: '',
  path: '/',
  relays: DEFAULT_RELAYS.join('\n'),
  blossoms: DEFAULT_BLOSSOMS.join('\n')
})

const loading = ref(false)
const error = ref('')
const result = ref(null)

const namedIdentifierState = computed(() => {
  const value = form.identifier.trim().toLowerCase()

  if (!value) {
    return 'Leave blank to inspect only the root site.'
  }

  return isValidNamedSiteIdentifier(value)
    ? 'Canonical NIP-5A slug.'
    : 'Lookup still works, but canonical named gateway links need a 1-13 char lowercase slug.'
})

const runInspection = async () => {
  loading.value = true
  error.value = ''

  try {
    result.value = await inspectSite({
      pubkeyInput: form.pubkeyInput,
      identifier: form.identifier,
      path: form.path,
      relays: form.relays,
      blossoms: form.blossoms
    })
  } catch (inspectionError) {
    error.value = inspectionError.message || 'Failed to inspect this Nsite.'
    result.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp) => timestamp ? new Date(timestamp * 1000).toLocaleString() : 'Unknown'
const prettyJson = (value) => JSON.stringify(value, null, 2)

onMounted(() => {
  if (typeof route.query.pubkey === 'string') {
    form.pubkeyInput = route.query.pubkey
  }

  if (typeof route.query.identifier === 'string') {
    form.identifier = route.query.identifier
  }

  if (typeof route.query.path === 'string') {
    form.path = route.query.path
  }

  if (form.pubkeyInput) {
    runInspection()
  }
})
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="surface rounded-[2rem] border border-[var(--color-line)] p-8 sm:p-10">
          <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Debugger</div>
          <h1 class="mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] text-[var(--color-fg)] sm:text-6xl">
            Inspect an Nsite as a chain of facts.
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-8 text-[var(--color-soft)]">
            This route reads identity, relay hints, manifests, path tags, blossom servers, and public gateway outputs without touching a signer.
          </p>
        </div>

        <div class="ink-panel rounded-[2rem] border border-[var(--color-line)] p-8 sm:p-10">
          <div class="ink-panel-soft text-[11px] font-semibold uppercase tracking-[0.32em]">Flow</div>
          <div class="ink-panel-soft mt-5 space-y-3 text-sm leading-7">
            <div>1. Decode npub or hex pubkey.</div>
            <div>2. Read `10002` relay hints.</div>
            <div>3. Query `15128`, `35128`, and legacy `34128`.</div>
            <div>4. Resolve the requested path to a content hash.</div>
            <div>5. Probe blossom servers and gateway URLs.</div>
          </div>
        </div>
      </section>

      <section class="surface mt-6 rounded-[2rem] border border-[var(--color-line)] p-6 sm:p-8">
        <div class="grid gap-5 lg:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Npub or hex pubkey</span>
            <input v-model="form.pubkeyInput" type="text" placeholder="npub1... or 64-char hex" class="w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 outline-none transition focus:border-[var(--color-fg)]">
          </label>

          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Named site identifier</span>
            <input v-model="form.identifier" type="text" placeholder="blog" class="w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 lowercase outline-none transition focus:border-[var(--color-fg)]">
            <p class="text-xs leading-6 text-[var(--color-soft)]">{{ namedIdentifierState }}</p>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Requested path</span>
            <input v-model="form.path" type="text" placeholder="/ or /index.html" class="w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 outline-none transition focus:border-[var(--color-fg)]">
          </label>

          <div class="rounded-[1.25rem] border border-[var(--color-line)] p-4 text-sm leading-7 text-[var(--color-soft)]">
            One relay or blossom server per line. Inputs are normalized and deduplicated before each query pass.
          </div>

          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Relays</span>
            <textarea v-model="form.relays" rows="6" class="w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 outline-none transition focus:border-[var(--color-fg)]" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-semibold text-[var(--color-fg)]">Blossom servers</span>
            <textarea v-model="form.blossoms" rows="6" class="w-full rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 outline-none transition focus:border-[var(--color-fg)]" />
          </label>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" class="rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-85 disabled:opacity-60" :disabled="loading" @click="runInspection">
            {{ loading ? 'Inspecting...' : 'Run inspection' }}
          </button>
          <NuxtLink to="/examples" class="rounded-full border border-[var(--color-line)] bg-[var(--color-card-strong)] px-6 py-3 text-sm font-semibold no-underline transition hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]">
            Open examples
          </NuxtLink>
        </div>

        <div v-if="error" class="mt-6 rounded-[1.25rem] border border-[var(--color-line)] bg-[var(--color-card-strong)] px-4 py-3 text-sm text-[var(--color-fg)]">
          {{ error }}
        </div>
      </section>

      <section v-if="result" class="mt-6 space-y-6">
        <div class="grid gap-6 xl:grid-cols-2">
          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Identity</div>
            <h2 class="mt-4 text-3xl font-semibold text-[var(--color-fg)]">{{ result.profile?.name || result.profile?.display_name || result.identity.npub }}</h2>
            <p class="mt-4 text-sm leading-7 text-[var(--color-soft)]">{{ result.profile?.about || 'No kind 0 metadata returned from the queried relays.' }}</p>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <div class="rounded-[1.25rem] border border-[var(--color-line)] p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">Npub</div>
                <div class="mt-2 break-all text-sm text-[var(--color-fg)]">{{ result.identity.npub }}</div>
              </div>
              <div class="rounded-[1.25rem] border border-[var(--color-line)] p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">Pubkey</div>
                <div class="mt-2 break-all text-sm text-[var(--color-fg)]">{{ result.identity.pubkey }}</div>
              </div>
            </div>
          </article>

          <article class="ink-panel rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="ink-panel-soft text-[11px] font-semibold uppercase tracking-[0.32em]">Gateway links</div>
            <div class="mt-5 space-y-4">
              <div v-for="link in result.gatewayLinks" :key="link.host" class="ink-panel-line rounded-[1.25rem] border p-4">
                <div class="flex items-center justify-between gap-3">
                  <div class="font-semibold">{{ link.host }}</div>
                  <div class="ink-panel-soft text-xs uppercase tracking-[0.18em]">{{ link.confidence }}</div>
                </div>
                <div class="mt-3 flex flex-wrap gap-3 text-sm">
                  <a :href="link.rootSiteUrl" target="_blank" rel="noreferrer" class="ink-panel-line rounded-full border px-4 py-2 no-underline transition hover:bg-[var(--color-bg)] hover:text-[var(--color-fg)]">Root</a>
                  <a v-if="link.namedUrl" :href="link.namedUrl" target="_blank" rel="noreferrer" class="ink-panel-line rounded-full border px-4 py-2 no-underline transition hover:bg-[var(--color-bg)] hover:text-[var(--color-fg)]">Named</a>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="grid gap-6 xl:grid-cols-3">
          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Relay list</div>
            <div class="mt-5 space-y-2 text-sm text-[var(--color-fg)]">
              <div v-for="relay in result.relayList.urls.length ? result.relayList.urls : result.relays" :key="relay" class="break-all rounded-[1rem] border border-[var(--color-line)] px-3 py-2">
                {{ relay }}
              </div>
            </div>
          </article>

          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Manifest status</div>
            <div class="mt-5 space-y-3 text-sm text-[var(--color-fg)]">
              <div class="flex items-center justify-between rounded-[1rem] border border-[var(--color-line)] px-4 py-3"><span>Root 15128</span><span>{{ result.manifests.root ? 'Found' : 'Missing' }}</span></div>
              <div class="flex items-center justify-between rounded-[1rem] border border-[var(--color-line)] px-4 py-3"><span>Named 35128</span><span>{{ result.manifests.named ? 'Found' : 'Missing' }}</span></div>
              <div class="flex items-center justify-between rounded-[1rem] border border-[var(--color-line)] px-4 py-3"><span>Legacy 34128</span><span>{{ result.legacy.files.length }}</span></div>
            </div>
          </article>

          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Path resolution</div>
            <div class="mt-5 text-sm leading-7 text-[var(--color-soft)]">
              <div><strong class="text-[var(--color-fg)]">Requested:</strong> {{ result.pathResolution.requestedPath }}</div>
              <div><strong class="text-[var(--color-fg)]">Match:</strong> {{ result.pathResolution.match?.path || 'None' }}</div>
              <div class="break-all"><strong class="text-[var(--color-fg)]">Hash:</strong> {{ result.pathResolution.match?.hash || 'Not resolved' }}</div>
            </div>
          </article>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Blossom checks</div>
            <div class="mt-5 space-y-3 text-sm">
              <div v-for="check in result.blobChecks" :key="check.url" class="rounded-[1rem] border border-[var(--color-line)] px-4 py-3">
                <div class="flex items-center justify-between gap-3">
                  <div class="break-all font-medium text-[var(--color-fg)]">{{ check.server }}</div>
                  <div class="text-[var(--color-soft)]">{{ check.status || 'ERR' }}</div>
                </div>
                <div class="mt-1 text-[var(--color-soft)]">{{ check.contentType || check.error || 'No content headers returned.' }}</div>
              </div>
              <div v-if="!result.blobChecks.length" class="rounded-[1rem] border border-[var(--color-line)] px-4 py-3 text-[var(--color-soft)]">
                No hash resolved for this path yet.
              </div>
            </div>
          </article>

          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Manifest details</div>
            <div class="mt-5 space-y-3 text-sm text-[var(--color-soft)]">
              <div><strong class="text-[var(--color-fg)]">Updated:</strong> {{ formatDate(result.manifests.active?.created_at) }}</div>
              <div><strong class="text-[var(--color-fg)]">Title:</strong> {{ result.manifests.active?.title || 'None' }}</div>
              <div><strong class="text-[var(--color-fg)]">Description:</strong> {{ result.manifests.active?.description || 'None' }}</div>
              <div><strong class="text-[var(--color-fg)]">Path count:</strong> {{ result.manifests.active?.paths?.length || 0 }}</div>
            </div>
          </article>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Active manifest JSON</div>
            <pre class="mt-5 overflow-x-auto rounded-[1.25rem] p-4 text-xs leading-6">{{ prettyJson(result.manifests.active?.raw || { note: 'No active manifest selected.' }) }}</pre>
          </article>

          <article class="surface rounded-[1.75rem] border border-[var(--color-line)] p-6">
            <div class="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-soft)]">Legacy files JSON</div>
            <pre class="mt-5 overflow-x-auto rounded-[1.25rem] p-4 text-xs leading-6">{{ prettyJson(result.legacy.files.slice(0, 10)) }}</pre>
          </article>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>
