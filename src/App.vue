<script setup lang="ts">
import { ref } from 'vue'

import BookmarkComponent from './components/Bookmark.vue'
import Bookmark from './models/Bookmark';

const bookmarks = ref([
  {
    id: '1',
    userId: 'userId',
    title: 'Razerの大判ハイブリッドマウスマットやリストレストが30日発売 - AKIBA PC Hotline!',
    url: 'https://akiba-pc.watch.impress.co.jp/docs/news/news/1354212.html',
    tags: ['tag1', 'tag2'],
    description: '',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: 'userId',
    title: 'Razerの大判ハイブリッドマウスマットやリストレストが30日発売 - AKIBA PC Hotline!',
    url: 'https://akiba-pc.watch.impress.co.jp/docs/news/news/1354212.html',
    tags: ['tag1', 'tag2'],
    description: '',
    createdAt: new Date(),
  },
])

const update = (bookmark: Bookmark) => {
  const newBookmarks = Array.from(bookmarks.value)
  const index = bookmarks.value.findIndex(b => b.id === bookmark.id)
  newBookmarks[index] = bookmark
  bookmarks.value = newBookmarks
}

const remove = (bookmarkId: string) => {
  bookmarks.value = bookmarks.value.filter(b => b.id !== bookmarkId)
}
</script>

<template>
  <div>
    <router-view />
    <BookmarkComponent
      v-for="bookmark in bookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"
      @update="update"
      @remove="remove"
    />
  </div>
</template>

<style>
@import 'bulma/css/bulma.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  padding: 32px;
}
</style>

<style lang="scss" scoped>
.bookmark:not(:first-of-type) {
  margin-top: 32px;
}
</style>
