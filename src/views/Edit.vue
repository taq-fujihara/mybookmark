<template>
  <div>
    <div class="field">
      <p class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="bookmark.url"
          placeholder="URL"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-bookmark"></i>
        </span>
      </p>
      <p
        class="control has-icons-left"
        :class="{ 'is-loading': fetchingMetaInfo }"
      >
        <input
          class="input"
          type="text"
          v-model="bookmark.title"
          :placeholder="fetchingMetaInfo ? 'Fetching Title...' : 'Title'"
          :disabled="fetchingMetaInfo"
          required
        />
        <span class="icon is-small is-left">
          <i class="fas fa-heading"></i>
        </span>
      </p>
      <p class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="tags"
          placeholder="Tags splitted by white space"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-tags"></i>
        </span>
      </p>
      <p class="tags-container">
        <Tags
          :highlightedTags="bookmark.tags"
          @tagClick="tags = `${tags} ${$event}`"
        />
      </p>
      <p class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="bookmark.description"
          placeholder="Description"
          maxlength="100"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-comment"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button class="button is-primary" @click="edit">
          {{ operationText }}
        </button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import Tags from "@/components/Tags.vue";
import Bookmark from "@/models/Bookmark";
import Repository from "@/repository";
import { getMetaInfo } from "@/util/url";

@Component({
  components: { Tags }
})
export default class Edit extends Vue {
  @Prop()
  id!: string;

  fetchingMetaInfo = false;

  private get operationText(): string {
    return this.id ? "Edit" : "Add";
  }

  private get tags(): string {
    return this.bookmark.tags.join(" ");
  }

  private set tags(value: string) {
    this.bookmark.tags = value.split(" ");
  }

  bookmark: Bookmark = {
    id: "",
    userId: this.$store.state.user.id,
    title: "",
    url: "",
    tags: [],
    description: "",
    createdAt: new Date()
  };

  async created() {
    if (this.id) {
      this.bookmark = await Repository.getBookmark(
        this.$store.state.user.id,
        this.id
      );
    }
  }

  @Watch("bookmark.url")
  async setMetaInfo(v: string) {
    if (!v) {
      return;
    }

    // inhibit user input
    this.fetchingMetaInfo = true;

    try {
      const meta = await getMetaInfo(v);
      this.bookmark.title += meta.title;
    } catch (error) {
      // NOP
    }

    this.fetchingMetaInfo = false;
  }

  async edit(bookmarkContent: Bookmark) {
    if (!this.id) {
      await Repository.addBookmark(this.bookmark);
    } else {
      await Repository.editBookmark(this.bookmark);
    }

    this.$router.push("/bookmarks");
  }
}
</script>

<style lang="scss" scoped>
.control {
  margin-top: var(--spacing-large);
}

.tags-container {
  margin-top: var(--spacing-small);
}
</style>
