<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ 
  label: string,
  canDelete?: boolean,
}>()

const emit = defineEmits<{
  (e: 'remove', value: string): void,
}>()

const remove = () => {
  emit('remove', props.label)
}
</script>

<template>
	<span class="tag">
    {{label}}
    <button v-if="canDelete" class="delete is-small" @click="remove"></button>
  </span>
</template>

<style lang="scss" scoped>
.bookmark__title {
  align-items: start;
  display: flex;
  line-height: 1.5;
}

.bookmark__favicon {
  padding-top: 3px;
  padding-right: 8px;
}
</style>
