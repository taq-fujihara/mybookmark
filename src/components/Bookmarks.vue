<template>
  <div>
    <div
      class="bookmark-container"
      v-for="bookmark in bookmarks"
      :key="bookmark.id"
    >
      <BookmarkElement
        :bookmark="bookmark"
        :highlightedTags="highlightedTags"
        @tagClick="$emit('tagClick', $event)"
        @edit="$router.push(`/bookmarks/edit/${$event.id}`)"
        @delete="deleteBookmark($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import Bookmark from "@/models/Bookmark";
import BookmarkElement from "@/components/BookmarkElement.vue";
import Repository from "@/repository";

@Component({
  components: {
    BookmarkElement
  }
})
export default class Bookmarks extends Vue {
  @Prop({ default: () => [] })
  bookmarks!: Array<Bookmark>;

  @Prop({ default: () => [] })
  highlightedTags!: Array<string>;

  async deleteBookmark(bookmark: Bookmark): Promise<void> {
    await Repository.deleteBookmark(bookmark);
  }
}
</script>

<style lang="scss" scoped>
.bookmark-container {
  margin-top: 32px;
}
</style>
