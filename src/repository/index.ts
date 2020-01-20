import { firestore } from "@/firebaseApp";
import Bookmark from "@/models/Bookmark";
import BookmarkFilter from "@/models/BookmarksFilter";

const db = firestore;

function cleanTags(tags: Array<string>): Object {
  // drop duplicates
  const distinct = Array.from(new Set<string>(tags));
  const sorted = distinct.sort().map(tag => [tag, true]);
  return Object.fromEntries(sorted);
}

function getTagArray(tagMap: Object): Array<string> {
  return Object.entries(tagMap).map(([key, _]) => key);
}

export default {
  async getBookmark(userId: string, bookmarkId: string): Promise<Bookmark> {
    const docRef = await db
      .collection(`users/${userId}/bookmarks`)
      .doc(bookmarkId)
      .get();

    if (!docRef.exists) {
      throw new Error(`Bookmark not found: ${bookmarkId}`);
    }

    const data = docRef.data();
    if (!data) {
      throw new Error(`Bookmark data is unexpectedly empty: ${bookmarkId}`);
    }

    return {
      id: docRef.id,
      userId: userId,
      title: data.title,
      url: data.url,
      tags: getTagArray(data.tags).sort(),
      description: data.description,
      createdAt: data.createdAt.toDate()
    };
  },
  // getBookmarks(userId: string): Promise<Array<Bookmark>> {
  //   return (
  //     bookmarksCollection
  //       .where("userId", "==", userId)
  //       // .orderBy("createdAt", "desc")
  //       .get()
  //       .then(snapshot => {
  //         const bookmarks: Array<Bookmark> = [];
  //         snapshot.forEach(doc => {
  //           const data = doc.data();
  //           bookmarks.push({
  //             id: doc.id,
  //             title: data.title,
  //             url: data.url,
  //             tags: data.tags.sort(),
  //             description: data.description,
  //             createdAt: data.createdAt.toDate()
  //           });
  //         });
  //         return bookmarks;
  //       })
  //   );
  // },
  onBookmarksUpdated(
    userId: string,
    filter: BookmarkFilter,
    callback: (bookmarks: Array<Bookmark>) => void
  ): () => void {
    let bookmarksRef:
      | firebase.firestore.CollectionReference
      | firebase.firestore.Query = db.collection(`users/${userId}/bookmarks`);

    if (filter.tags && filter.tags.length > 0) {
      filter.tags.forEach(tag => {
        bookmarksRef = bookmarksRef.where(`tags.${tag}`, "==", true);
      });
    }

    return bookmarksRef.orderBy("createdAt", "desc").onSnapshot(snapshot => {
      const bookmarks: Array<Bookmark> = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        bookmarks.push({
          id: doc.id,
          userId: userId,
          title: data.title,
          url: data.url,
          tags: getTagArray(data.tags).sort(),
          description: data.description,
          createdAt: data.createdAt.toDate()
        });
      });
      callback(bookmarks);
    });
  },
  async addBookmark(bookmark: Bookmark): Promise<void> {
    try {
      await db.collection(`users/${bookmark.userId}/bookmarks`).add({
        title: bookmark.title,
        url: bookmark.url,
        tags: cleanTags(bookmark.tags),
        description: bookmark.description,
        createdAt: new Date()
      });
    } catch (error) {
      throw new Error("Failed to add bookmark");
    }
  },
  async editBookmark(bookmark: Bookmark): Promise<void> {
    try {
      const docRef = await db
        .collection(`users/${bookmark.userId}/bookmarks`)
        .doc(bookmark.id);

      await docRef.update({
        title: bookmark.title,
        url: bookmark.url,
        tags: cleanTags(bookmark.tags),
        description: bookmark.description
      });
    } catch (error) {
      throw new Error("Failed to add bookmark");
    }
  },
  async deleteBookmark(bookmark: Bookmark): Promise<void> {
    try {
      await db
        .collection(`users/${bookmark.userId}/bookmarks`)
        .doc(bookmark.id)
        .delete();
    } catch (error) {
      throw new Error(`Failed to delete bookmark: ${bookmark.id}`);
    }
  }
};
