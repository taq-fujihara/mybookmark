<template>
  <div class="home">
    <div class="filter">
      <i class="fas fa-filter" />
      <div class="tags">
        <Tag v-for="tag in filter.tags" :key="tag" :primary="true">
          {{ tag }}
          <button
            class="delete is-small"
            @click="removeFilterTag(tag)"
          ></button>
        </Tag>
      </div>
      <input
        class="input is-small filter-tag-input"
        type="text"
        v-model="filterTagInput"
        @keydown.enter="
          addFilterTag(filterTagInput);
          filterTagInput = '';
        "
        @keydown.space="
          addFilterTag(filterTagInput);
          filterTagInput = '';
        "
        placeholder="Tag"
      />
    </div>
    <div>
      <div>
        <span class="sub-text">
          Recently Created
        </span>
      </div>
      <div class="tags">
        <Tag
          v-for="tag in $store.state.tags"
          :key="tag"
          :text="tag"
          :primary="filter.tags.includes(tag)"
          :light="true"
          @click="toggleFilterTag(tag)"
        />
      </div>
    </div>
    <div>
      <Bookmarks
        :bookmarks="bookmarks"
        :highlightedTags="filter.tags"
        @tagClick="toggleFilterTag"
      />
    </div>
    <div class="show-more sub-text" v-if="!$store.state.bookmarksAllFetched">
      <a @click="fetchMore">more...</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import Bookmarks from "@/components/Bookmarks.vue";
import Tag from "@/components/Tag.vue";
import Bookmark from "@/models/Bookmark";
import BookmarkFilter from "@/models/BookmarksFilter";

@Component({
  components: {
    Bookmarks,
    Tag
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

  filterTagInput = "";

  @Watch("filter", { immediate: true })
  async onFilterChange(filter: BookmarkFilter) {
    await this.$store.dispatch("fetchBookmarks", { filter });
  }

  toggleFilterTag(tag: string): void {
    if (this.filter.tags.includes(tag)) {
      this.removeFilterTag(tag);
    } else {
      this.addFilterTag(tag);
    }
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
.filter {
  display: flex;
  align-items: center;
}

.show-more {
  margin-top: var(--spacing-large);
}

.filter-tag-input {
  width: 100px;
  margin-left: var(--spacing-small);
}
</style>
