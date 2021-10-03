<script setup lang="ts">
import Tag from './Tag.vue'

import { Ref, ref } from 'vue'
import Bookmark from '../models/Bookmark'

const props = defineProps<{ bookmark: Bookmark }>()

const emit = defineEmits<{
  (e: 'update', value: Bookmark): void,
  (e: 'remove', value: string): void,
}>()

const isEditing = ref(false)
const tagLabel = ref('')
const newBookmark: Ref<Bookmark> = ref(undefined as unknown as Bookmark)

const startEditing = () => {
  isEditing.value = true
  newBookmark.value = { ...props.bookmark }
}

const save = () => {
  emit('update', newBookmark.value)
  isEditing.value = false
}

const remove = () => {
  emit('remove', props.bookmark.id)
}

const addTag = () => {
  if (!tagLabel.value) {
    return
  }
  newBookmark.value.tags = [
    ...newBookmark.value.tags,
    tagLabel.value.trim(),
  ]
  tagLabel.value = ''
}

const removeTag = (tag: string) => {
  newBookmark.value = {
    ...newBookmark.value,
    tags: newBookmark.value.tags.filter(t => t !== tag),
  }
}
</script>

<template>
	<div class="bookmark">
    <div class="bookmark__title">
      <img class="bookmark__favicon" src="https://www.google.com/s2/favicons?domain=akiba-pc.watch.impress.co.jp" alt="favicon">
      <a v-if="!isEditing" href="https://akiba-pc.watch.impress.co.jp/docs/news/news/1354212.html"
        target="_blank"
        rel="noopener noreferrer">
        {{bookmark.title}}
      </a>
      <input v-else class="input is-primary" v-model="newBookmark.title" type="text" placeholder="Title">
    </div>
    <div v-if="!isEditing" class="tags bookmark__tags">
      <Tag v-for="tag in bookmark.tags" :key="tag" :label="tag" />
    </div>
    <div v-else class="tags bookmark__tags">
      <Tag
        v-for="tag in newBookmark.tags"
        :key="tag"
        :label="tag"
        can-delete
        @remove="removeTag"
      />
      <input
        class="input is-small"
        type="text"
        v-model="tagLabel"
        placeholder="New Tag"
        @keydown.enter="addTag"
      >
    </div>
    <div v-if="isEditing">
    </div>

    <div class="bookmark__actions">
      <span v-if="!isEditing">
        bookmarked at 2021/9/30
      </span>
      <span v-if="!isEditing">
        <a href="#" @click="startEditing">
          <font-awesome-icon icon="edit" />&nbsp;edit
        </a>
      </span>
      <span v-if="isEditing" @click="isEditing = !isEditing">
        <a href="#">
          <font-awesome-icon icon="arrow-left" />&nbsp;cancel
        </a>
      </span>
       <span v-if="isEditing">
        <a href="#" @click="save">
          <font-awesome-icon icon="save" />&nbsp;save
        </a>
      </span>
      <span></span>
      <span v-if="isEditing">
        <a href="#" style="color: red;" @click="remove">
          <font-awesome-icon icon="trash-alt" />&nbsp;delete
        </a>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.bookmark {

  &__title {
    align-items: start;
    display: flex;
    line-height: 1.5;
  }

  &__favicon {
    padding-top: 3px;
    padding-right: 8px;
  }

  &__actions {
    font-size: small;
    opacity: 0.7;

    span:not(:first-of-type) {
      margin-left: 12px;
    }
  }

  &__tags {
    margin-top: 8px;
    margin-bottom: 0 !important;

    input {
      width: 150px;
    }
  }
 

  &__creation-time {
    font-size: small;
    color: gray;
  }
}
</style>
