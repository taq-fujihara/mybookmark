<template>
  <div class="bookmark">
    <div class="bookmark-info">
      <div class="bookmark-title">
        {{ bookmark.title }}
      </div>
      <div class="tag-list">
        <span
          class="tag is-light tag-list__tag clickable"
          :class="{ 'is-primary': highlightedTags.includes(tag) }"
          v-for="tag in bookmark.tags"
          :key="tag"
          @click="$emit('tagClick', tag)"
        >
          {{ tag }}
        </span>
      </div>
      <div class="bookmark-link">
        <a :href="bookmark.url" target="_blank" rel="noopener noreferrer">
          {{ bookmark.url }}
        </a>
      </div>
      <div class="description sub-text">
        {{ bookmark.description }}
      </div>
      <div class="created-at sub-text">
        {{ createdAt }}
      </div>
      <div class="bookmark-actions button-list">
        <span
          class="icon is-small button-list__button clickable"
          @click="$emit('edit', bookmark)"
        >
          <i class="fas fa-edit"></i>
        </span>
        <span
          class="icon is-small button-list__button clickable"
          @click="$emit('delete', bookmark)"
        >
          <i class="fas fa-archive"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import Bookmark from "@/models/Bookmark";

@Component
export default class BookmarkElement extends Vue {
  @Prop({ required: true }) bookmark!: Bookmark;

  @Prop({ default: () => [] }) highlightedTags!: Array<string>;

  private get createdAt(): String {
    const y = this.bookmark.createdAt.getFullYear();
    const m = this.bookmark.createdAt.getMonth() + 1;
    const d = this.bookmark.createdAt.getDate();
    const h = this.bookmark.createdAt.getHours();
    const mi = this.bookmark.createdAt.getMinutes();
    return `${y}/${m}/${d} ${h}:${mi}`;
  }
}
</script>

<style lang="scss" scoped>
.bookmark {
  div {
    margin-top: var(--spacing-small);
  }
}

.bookmark-link {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bookmark-actions {
  .icon {
    transition: color 0.2s;

    &:not(:hover) {
      color: #90a4ae;
    }
  }
}
</style>
