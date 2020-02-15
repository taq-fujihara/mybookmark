<template>
  <div class="tags-container">
    <div class="tag-container" v-for="tag in tags" :key="tag.id">
      <div>
        <i class="fas fa-tag sub-text"></i>
        <a class="text-with-icon" @click="showBookmarks(tag.tagName)">
          {{ tag.tagName }}
        </a>
      </div>
      <div>
        <i class="fas fa-bookmark sub-text"></i>
        <span class="text-with-icon">{{ tag.bookmarkCount }}</span>
      </div>
      <div class="tag-actions button-list">
        <span
          class="icon is-small button-list__button clickable"
          @click="openTagEditModal(tag)"
        >
          <i class="fas fa-edit"></i>
        </span>
        <span
          class="icon is-small button-list__button clickable"
          @click="deleteTag(tag)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': !!tag.id }">
      <div class="modal-background" @click="tag.id = ''"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <div class="field">
              <p class="control has-icons-left">
                <input
                  class="input"
                  type="text"
                  v-model="tag.tagName"
                  placeholder="Tag Text"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-tag"></i>
                </span>
              </p>
            </div>
            <div>
              <button class="button is-primary" @click="saveChanges">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="tag.id = ''"
      ></button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Tag from "@/models/Tag";
import Repository from "@/repository";

@Component
export default class Tags extends Vue {
  tags = new Array<Tag>();
  tag: Tag = {
    id: "",
    tagName: "",
    bookmarkCount: 0,
    createdAt: new Date()
  };

  async mounted() {
    this.tags = await Repository.getTags(this.$store.state.user.id);
  }

  showBookmarks(tagName: string) {
    this.$router.push({
      path: "/bookmarks",
      query: {
        tags: tagName
      }
    });
  }

  openTagEditModal(tag: Tag): void {
    this.tag = { ...tag };
  }

  deleteTag(tag: Tag): void {
    alert("not implemented yet");
  }

  async saveChanges() {
    if (this.tag.id === this.tag.tagName.trim()) {
      alert("tag name not changed");
      return;
    }
    await Repository.editTag(this.$store.state.user.id, this.tag);
    this.tag.id = "";
  }
}
</script>

<style lang="scss" scoped>
.tag-container {
  margin-top: var(--spacing-large);
  display: flex;

  div {
    &:not(:first-of-type) {
      margin-left: var(--spacing-large);
    }
  }
}

.text-with-icon {
  margin-left: var(--spacing-small);
}

.tag-actions {
  .icon {
    transition: color 0.2s;

    &:not(:hover) {
      color: #90a4ae;
    }
  }
}
</style>
