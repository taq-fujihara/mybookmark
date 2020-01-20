<template>
  <div class="home">
    <i class="fas fa-filter"></i>
    <span class="sub-text" v-if="filter.tags.length === 0">
      タグをクリックして絞り込みを追加
    </span>
    <span class="tag-list">
      <span
        class="tag is-primary tag-list__tag"
        v-for="tag in filter.tags"
        :key="tag"
      >
        {{ tag }}
        <button class="delete is-small" @click="removeFilterTag(tag)"></button>
      </span>
    </span>
    <div>
      <Bookmarks
        :bookmarks="bookmarks"
        :highlightedTags="filter.tags"
        @tagClick="addFilterTag"
      />
    </div>
    <div v-if="!$store.state.bookmarksAllFetched">
      <button class="button" @click="fetchMore">もっと</button>
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

  get filter(): BookmarkFilter {
    const filter: BookmarkFilter = {
      tags: []
    };

    const tags = this.$route.query.tags;
    if (tags) {
      filter.tags = typeof tags === "string" ? [tags] : (tags as Array<string>);
    }

    return filter;
  }

  @Watch("filter", { immediate: true })
  async onFilterChange(filter: BookmarkFilter) {
    await this.$store.dispatch("fetchBookmarks", { filter });
  }

  addFilterTag(tag: string): void {
    this.$router.push({
      name: this.$route.name,
      query: {
        tags: Array.from(new Set([...this.filter.tags, tag]))
      }
    });
  }

  removeFilterTag(tag: string): void {
    this.$router.push({
      name: this.$route.name,
      query: {
        tags: this.filter.tags.filter(t => t !== tag)
      }
    });
  }

  async fetchMore(): Promise<void> {
    await this.$store.dispatch("fetchBookmarks", {
      filter: this.filter,
      pagination: true
    });
  }
}
</script>

<style lang="scss" scoped>
.tag-list {
  margin-left: var(--spacing-small);
}
</style>
