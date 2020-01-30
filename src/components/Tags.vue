<template>
  <div class="tags-container">
    <div class="select is-small">
      <select v-model="tagsSort">
        <option value="createdAt/desc">Recently Created</option>
        <option value="tagName/asc">A-Z</option>
        <option value="tagName/desc">Z-A</option>
      </select>
    </div>
    <div class="tags">
      <Tag
        v-for="tag in $store.state.tags.list"
        :key="tag"
        :text="tag"
        :primary="highlightedTags.includes(tag)"
        :light="true"
        @click="$emit('tagClick', tag)"
      />
      <span class="sub-text tag is-white" v-if="$store.state.tags.more">
        <a @click="$store.dispatch('loadAllTags')">show all</a>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Tag from "@/components/Tag.vue";

@Component({
  components: { Tag }
})
export default class Tags extends Vue {
  @Prop({ default: () => [] })
  highlightedTags!: Array<string>;

  private p_tagsSort: string = "createdAt/desc";

  get tagsSort(): string {
    return this.p_tagsSort;
  }
  set tagsSort(value: string) {
    this.p_tagsSort = value;
    const values = value.split("/");
    this.$store.dispatch("loadTags", { by: values[0], order: values[1] });
  }
}
</script>

<style lang="scss" scoped>
.tags {
  margin-top: var(--spacing-small);
}
</style>
