<script setup>
const links = [
  { label: 'Home', to: '/' },
  { label: 'The Spec', to: '/the-spec' },
  { label: 'Napps', to: '/napps' },
  { label: 'Gateways', to: '/gateways' },
  { label: 'Debug', to: '/debug' },
  { label: 'Examples', to: '/examples' }
]

const route = useRoute()
const { theme, mounted, toggleTheme } = useTheme()

const themeLabel = computed(() => theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
const isDark = computed(() => theme.value === 'dark')

const navLinkClass = (path) => {
  if (route.path === path) {
    return isDark.value
      ? 'nav-active-dark'
      : 'nav-active-light'
  }

  return isDark.value
    ? 'nav-idle-dark'
    : 'nav-idle-light'
}
</script>

<template>
  <header class="site-header sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-bg)]/92 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="no-underline">
        <div class="flex items-center gap-4">
          <img
            src="/nostr-ostrich-running.gif"
            alt="Nsite logo"
            class="logo-invert h-[42px] w-[42px] object-contain"
          >
          <div>
            <div class="header-brand text-lg font-semibold text-[var(--color-fg)]">
              Nsite.info
              <span class="header-dot" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </NuxtLink>

      <div class="flex items-center gap-2 sm:gap-3">
        <nav class="hidden items-center gap-2 text-sm md:flex">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-full border px-4 py-2 no-underline transition"
            :class="navLinkClass(link.to)"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          :aria-label="themeLabel"
          class="theme-toggle flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-fg)] transition hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
          @click="toggleTheme"
        >
          <svg v-if="mounted && theme === 'dark'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25M12 18.75V21M4.72 4.72l1.59 1.59M17.69 17.69l1.59 1.59M3 12h2.25M18.75 12H21M4.72 19.28l1.59-1.59M17.69 6.31l1.59-1.59" />
            <circle cx="12" cy="12" r="4.5" />
          </svg>
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="border-t border-[var(--color-line)] px-4 py-3 md:hidden sm:px-6 lg:px-8">
      <nav class="mx-auto flex max-w-7xl flex-wrap gap-2 text-sm">
        <NuxtLink
          v-for="link in links"
          :key="`mobile-${link.to}`"
          :to="link.to"
          class="rounded-full border px-4 py-2 no-underline transition"
          :class="navLinkClass(link.to)"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-active-light {
  border-color: #000000;
  background: #000000;
  color: #ffffff !important;
  box-shadow: 0 0 0 2px var(--accent-purple), 0 0 18px var(--accent-purple-glow);
}

.nav-active-dark {
  border-color: #ffffff;
  background: #ffffff;
  color: #000000 !important;
  box-shadow: 0 0 0 2px var(--accent-purple), 0 0 18px var(--accent-purple-glow);
}

.nav-idle-light {
  border-color: var(--color-line);
  background: var(--color-card);
  color: var(--color-fg);
}

.nav-idle-light:hover {
  border-color: var(--accent-purple);
  background: #000000;
  color: #ffffff;
  box-shadow: 0 0 14px var(--accent-purple-soft);
}

.nav-idle-dark {
  border-color: var(--color-line);
  background: var(--color-card);
  color: var(--color-fg);
}

.nav-idle-dark:hover {
  border-color: var(--accent-purple);
  background: #ffffff;
  color: #000000;
  box-shadow: 0 0 14px var(--accent-purple-soft);
}

.logo-invert {
  filter: invert(1) contrast(1.06) drop-shadow(0 0 10px var(--accent-purple-glow));
}

.header-brand {
  text-shadow: 0 0 16px var(--accent-purple-glow);
}

.header-dot {
  display: inline-block;
  margin-left: 0.35rem;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: var(--accent-purple);
  box-shadow: 0 0 14px var(--accent-purple-glow);
  vertical-align: middle;
}

.theme-toggle {
  box-shadow: inset 0 0 0 1px transparent;
}

.theme-toggle:hover {
  box-shadow: 0 0 0 1px var(--accent-purple), 0 0 14px var(--accent-purple-glow);
}

.site-header {
  border-top: 2px solid var(--accent-purple);
  box-shadow: 0 2px 14px rgba(124, 58, 237, 0.18);
}
</style>
