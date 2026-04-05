<script setup>
const { theme } = useTheme()
</script>
<template>
  <div :data-theme="theme" class="min-h-screen">
    <NuxtPage />
  </div>
</template>
