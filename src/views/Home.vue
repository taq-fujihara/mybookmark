<template>
  <div class="home">
    <i class="fas fa-filter"></i>
    <span class="sub-text" v-if="filterTags.length === 0">
      タグをクリックして絞り込みを追加
    </span>
    <span class="tag-list">
      <span
        class="tag is-primary tag-list__tag"
        v-for="tag in filterTags"
        :key="tag"
      >
        {{ tag }}
        <button class="delete is-small" @click="removeFilterTag(tag)"></button>
      </span>
    </span>
    <div>
      <Bookmarks
        :bookmarks="bookmarks"
        :highlightedTags="filterTags"
        @tagClick="addFilterTag"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import Bookmarks from "@/components/Bookmarks.vue";
import Bookmark from "@/models/Bookmark";
import BookmarkFilter from "@/models/BookmarksFilter";

@Component({
  components: {
    Bookmarks
  }
})
export default class Home extends Vue {
  get bookmarks(): Array<Bookmark> {
    return this.$store.state.bookmarks;
  }

  get filterTags(): Array<string> {
    const tags = this.$route.query.tags;

    if (!tags) {
      return [];
    }

    return tags as Array<string>;
  }

  @Watch("$route.query", { immediate: true })
  async onFilterChange(filter: BookmarkFilter) {
    if (typeof filter.tags === "string") {
      filter.tags = [filter.tags];
    }
    await this.$store.dispatch("fetchBookmarks", filter);
  }

  addFilterTag(tag: string): void {
    this.$router.push({
      name: this.$route.name,
      query: {
        tags: Array.from(new Set([...this.filterTags, tag]))
      }
    });
  }

  removeFilterTag(tag: string): void {
    this.$router.push({
      name: this.$route.name,
      query: {
        tags: this.filterTags.filter(t => t !== tag)
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.tag-list {
  margin-left: var(--spacing-small);
}
</style>
