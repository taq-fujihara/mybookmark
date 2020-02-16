<template>
  <div class="bookmark">
    <div
      class="bookmark-title"
      :class="{ 'no-title': !bookmark.title, 'bookmark-link': !bookmark.title }"
    >
      <img v-if="faviconSrc" :src="faviconSrc" />
      <a :href="bookmark.url" target="_blank" rel="noopener noreferrer">
        {{ bookmark.title || bookmark.url }}
      </a>
    </div>
    <div class="tags">
      <Tag
        v-for="tag in bookmark.tags"
        :key="tag"
        :text="tag"
        :primary="highlightedTags.includes(tag)"
        :light="true"
        @click="$emit('tagClick', tag)"
      />
    </div>
    <div class="created-at sub-text">
      {{ createdAt }}
    </div>
    <div class="description sub-text">
      {{ bookmark.description }}
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
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import Bookmark from "@/models/Bookmark";
import Tag from "@/components/Tag.vue";
import { getFaviconUrl } from "@/util/favicon";

@Component({
  components: { Tag }
})
export default class BookmarkElement extends Vue {
  @Prop({ required: true }) bookmark!: Bookmark;

  @Prop({ default: () => [] }) highlightedTags!: Array<string>;

  private get createdAt(): string {
    const y = this.bookmark.createdAt.getFullYear();
    const m = this.bookmark.createdAt.getMonth() + 1;
    const d = this.bookmark.createdAt.getDate();
    const h = this.bookmark.createdAt.getHours();
    const mi = this.bookmark.createdAt.getMinutes();
    return `${y}/${m}/${d} ${h}:${mi}`;
  }

  private get faviconSrc(): string {
    return getFaviconUrl(this.bookmark.url);
  }
}
</script>

<style lang="scss" scoped>
.bookmark {
  width: 100%;

  div {
    margin-top: var(--spacing-small);
  }
}

.bookmark-title {
  display: flex;
  align-items: center;

  img {
    margin-right: var(--spacing-small);
  }
}

.no-title {
  opacity: 0.7;
}

.bookmark-link {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.created-at {
  // すぐ上のタグリストでは下マージンがついているのでトップをキャンセル
  margin-top: 0 !important;
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
