<template>
  <div class="home columns">
    <div class="column is-one-third">
      <div class="filter">
        <div class="filter__selected">
          <i class="fas fa-filter" />
          <div class="tags">
            <Tag v-for="tag in filter.tags" :key="tag" :primary="true">
              {{ tag }}
              <button
                class="delete is-small"
                @click="removeFilterTag(tag)"
              ></button>
            </Tag>
            <!-- <input
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
          /> -->
          </div>
        </div>
      </div>
      <div class="selectable-tags">
        <Tags
          :highlightedTags="filter.tags"
          @tagClick="toggleFilterTag($event)"
        />
      </div>
    </div>
    <div class="column is-two-thirds">
      <a class="sub-text" @click="$router.push('/bookmarks/edit')">
        <i class="fas fa-plus-square" />
        Add Bookmark...
      </a>
      <Bookmarks
        :bookmarks="bookmarks"
        :highlightedTags="filter.tags"
        @tagClick="toggleFilterTag"
      />
      <div class="show-more sub-text" v-if="!$store.state.bookmarksAllFetched">
        <a @click="fetchMore">more...</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import Bookmarks from "@/components/Bookmarks.vue";
import Tag from "@/components/Tag.vue";
import Tags from "@/components/Tags.vue";
import Bookmark from "@/models/Bookmark";
import BookmarkFilter from "@/models/BookmarksFilter";

@Component({
  components: {
    Bookmarks,
    Tag,
    Tags
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
@media screen and (min-width: 769px) {
  .columns {
    flex-direction: row-reverse;
  }
}

.home {
  margin-top: var(--spacing-large);
}

.filter {
  display: flex;
  align-items: center;

  &__selected {
    display: flex;
    align-items: center;
  }

  .tags {
    margin-left: var(--spacing-small);
  }
}

.selectable-tags {
  margin-top: var(--spacing-small);
}

.show-more {
  margin-top: var(--spacing-large);
}

.filter-tag-input {
  width: 100px;
}
</style>
