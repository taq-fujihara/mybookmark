<template>
  <div class="bookmark">
    <div class="bookmark-info">
      <div class="bookmark-title">
        {{ bookmark.title }}
        <span class="bookmark-tags">
          <span
            class="tag is-light"
            v-for="tag in bookmark.tags"
            :key="tag"
            @click="$emit('tagClick', tag)"
          >
            {{ tag }}
          </span>
        </span>
      </div>
      <div>
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
      <div class="bookmark-actions">
        <span class="icon is-small" @click="$emit('edit', bookmark)">
          <i class="fas fa-edit"></i>
        </span>
        <span class="icon is-small" @click="$emit('delete', bookmark)">
          <i class="fas fa-trash"></i>
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
  @Prop() private bookmark!: Bookmark;

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
$spacing-small: 8px;
$spacing-large: 32px;

.bookmark {
  div {
    margin-top: $spacing-small;
  }
}

.bookmark-info {
  .bookmark-tags {
    span {
      cursor: pointer;
      margin-left: 16px;
    }
  }

  .tag:not(:first-child) {
    margin-left: $spacing-small;
  }

  .description {
    font-size: small;
  }

  .created-at {
    font-size: small;
    opacity: 0.7;
  }

  .bookmark-actions {
    span:not(:first-of-type) {
      margin-left: 16px;
    }

    .icon {
      cursor: pointer;
      transition: color 0.2s;

      &:not(:hover) {
        color: #90a4ae;
      }
    }
  }
}
</style>
