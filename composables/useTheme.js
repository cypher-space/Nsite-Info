export const useTheme = () => {
  const theme = useState('theme', () => 'light')
  const mounted = useState('theme-mounted', () => false)

  const applyTheme = (value) => {
    if (typeof document === 'undefined') {
      return
    }

    document.documentElement.dataset.theme = value
    document.documentElement.style.colorScheme = value
    document.body.dataset.theme = value
  }

  const setTheme = (value) => {
    theme.value = value
    applyTheme(value)

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nsite-theme', value)
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    const savedTheme = typeof localStorage !== 'undefined'
      ? localStorage.getItem('nsite-theme')
      : null

    const preferredTheme = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

    setTheme(savedTheme || preferredTheme)
    mounted.value = true
  })

  return {
    theme,
    mounted,
    setTheme,
    toggleTheme
  }
}
