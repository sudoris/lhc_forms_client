import { computed, onUnmounted, ref, onBeforeMount } from 'vue'

export default function useBreakpoints () {
  const windowWidth = ref(window.innerWidth)

  const onWidthChange = () => { windowWidth.value = window.innerWidth }
  onBeforeMount(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))

  const width = computed(() => windowWidth.value)

  const type = computed(() => {
    if (windowWidth.value < 768) return 'sm'
    if (windowWidth.value >= 768 && windowWidth.value < 1200) return 'md'
    if (windowWidth.value >= 1200) return 'lg'
    return ''
  })

  return { width, type }
}
