<template>
  <span
    class="tag clickable"
    :class="{ 'is-primary': primary, 'is-light': light }"
    @click="$emit('click')"
  >
    {{ text }}
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tag extends Vue {
  @Prop({ default: "" }) text!: string;
  @Prop({ default: false }) light!: boolean;
  @Prop({ default: false }) primary!: boolean;
}
</script>
