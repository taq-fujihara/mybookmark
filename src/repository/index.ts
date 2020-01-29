import { firestore } from "@/firebaseApp";
import Bookmark from "@/models/Bookmark";
import BookmarkFilter from "@/models/BookmarksFilter";

type DocumentSnapshot = firebase.firestore.DocumentSnapshot<
  firebase.firestore.DocumentData
>;

const db = firestore;
const BATCH_GET_COUNT = 30;
let lastDoc: DocumentSnapshot | null;

function docToModel(userId: string, docRef: DocumentSnapshot): Bookmark {
  const data = docRef.data();
  if (!data) {
    throw new Error("Failed to retrieve data");
  }

  return {
    id: docRef.id,
    userId: userId,
    title: data.title,
    url: data.url,
    tags: data.tags.sort(),
    description: data.description,
    createdAt: data.createdAt.toDate()
  };
}

function cleanTags(tags: Array<string>): Array<string> {
  return Array.from(new Set<string>(tags))
    .filter(t => !!t)
    .sort();
}

async function getAllBookmarks(userId: string): Promise<Array<Bookmark>> {
  let query = db
    .collection(`users/${userId}/bookmarks`)
    .orderBy("createdAt", "desc")
    .limit(BATCH_GET_COUNT);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();

  const bookmarks: Array<Bookmark> = [];

  snapshot.forEach(doc => {
    bookmarks.push(docToModel(userId, doc));
    lastDoc = doc;
  });

  return bookmarks;
}

async function getTaggedBookmarks(
  userId: string,
  tags: Array<string>
): Promise<Array<Bookmark>> {
  const tagsSnapshot = await db
    .collection(`users/${userId}/tags`)
    .where("tagName", "in", tags)
    .orderBy("bookmarkCount", "asc")
    .limit(1)
    .get();

  if (tagsSnapshot.size === 0) {
    return [];
  }

  const minCountTag = tagsSnapshot.docs[0].data().tagName;
  const otherTags = tags.filter(t => t !== minCountTag);

  let query = db
    .collection(`users/${userId}/bookmarks`)
    .where("tags", "array-contains", minCountTag)
    .orderBy("createdAt", "desc")
    .limit(BATCH_GET_COUNT);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const bookmarks: Array<Bookmark> = [];

  const snapshot = await query.get();
  snapshot.forEach(doc => {
    const tags = doc.data().tags;
    if (otherTags.every(t => tags.includes(t))) {
      bookmarks.push(docToModel(userId, doc));
    }
    lastDoc = doc;
  });

  return bookmarks;
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

    return docToModel(userId, docRef);
  },
  async getBookmarks(
    userId: string,
    filter: BookmarkFilter,
    pagination: boolean = false
  ): Promise<Array<Bookmark>> {
    if (!pagination) {
      lastDoc = null;
    }

    const hasTagFilter = filter.tags && filter.tags.length > 0;

    if (hasTagFilter) {
      return await getTaggedBookmarks(userId, filter.tags);
    } else {
      return getAllBookmarks(userId);
    }
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
  },
  onTagsChange(
    userId: string,
    sort: {
      by: string;
      order: "asc" | "desc";
    },
    limit: number,
    callback: (tags: Array<string>) => void
  ): () => void {
    let query = db
      .collection(`users/${userId}/tags`)
      .orderBy(sort.by, sort.order);

    if (limit > 0) {
      query = query.limit(limit);
    }

    return query.onSnapshot(snapshot => {
      const tags = snapshot.docs.map(docRef => docRef.data().tagName);
      callback(tags);
    });
  }
};
