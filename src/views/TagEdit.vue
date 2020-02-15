<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import Tags from "@/components/Tags.vue";
import Tag from "@/models/Tag";
import Repository from "@/repository";

@Component
export default class TagEdit extends Vue {
  @Prop()
  id!: string;

  tag: Tag = {
    id: "",
    tagName: "",
    bookmarkCount: 0,
    createdAt: new Date()
  };

  async created() {
    this.tag = await Repository.getTag(this.$store.state.user.id, this.id);
  }

  async save() {
    if (this.tag.id === this.tag.tagName.trim()) {
      alert("tag name not changed");
      return;
    }
    await Repository.editTag(this.$store.state.user.id, this.tag);
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
