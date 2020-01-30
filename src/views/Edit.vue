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
      <p class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="bookmark.title"
          placeholder="Title"
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
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import Tags from "@/components/Tags.vue";
import Bookmark from "@/models/Bookmark";
import Repository from "@/repository";

@Component({
  components: { Tags }
})
export default class Edit extends Vue {
  @Prop()
  id!: string;

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
