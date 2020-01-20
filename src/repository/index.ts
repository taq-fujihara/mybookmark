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
  // drop duplicates
  const distinct = Array.from(new Set<string>(tags));
  return distinct.sort();
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

    let query:
      | firebase.firestore.CollectionReference
      | firebase.firestore.Query = db.collection(`users/${userId}/bookmarks`);

    if (filter.tags && filter.tags.length > 0) {
      query = query.where("tags", "array-contains-any", filter.tags);
    }

    query = query.orderBy("createdAt", "desc").limit(BATCH_GET_COUNT);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }
    const snapshot = await query.get();

    const bookmarks: Array<Bookmark> = [];

    let hasAllTags: (
      bookmarkTags: Array<string>,
      filterTags: Array<string>
    ) => boolean;

    if (filter.tags && filter.tags.length > 0) {
      hasAllTags = (bookmarkTags: Array<string>, filterTags: Array<string>) => {
        return filterTags.map(t => bookmarkTags.includes(t)).every(r => r);
      };
    } else {
      hasAllTags = () => true;
    }

    snapshot.forEach(doc => {
      const bookmark = docToModel(userId, doc);
      // array-contains-anyでは、何れかのタグが含まれるブックマークが引っかかる。
      // 実際にやりたいのは全てのタグが含まれるブックマークを拾いたいので、
      // 全タグが入っているものを抜き出す。
      if (hasAllTags(bookmark.tags, filter.tags)) {
        bookmarks.push(bookmark);
      }

      lastDoc = doc;
    });

    return bookmarks;
  },
  // onBookmarksUpdated(
  //   userId: string,
  //   filter: BookmarkFilter,
  //   callback: (bookmarks: Array<Bookmark>) => void
  // ): () => void {
  //   let bookmarksRef:
  //     | firebase.firestore.CollectionReference
  //     | firebase.firestore.Query = db.collection(`users/${userId}/bookmarks`);

  //   if (filter.tags && filter.tags.length > 0) {
  //     filter.tags.forEach(tag => {
  //       bookmarksRef = bookmarksRef.where(`tags.${tag}`, "==", true);
  //     });
  //   }

  //   return bookmarksRef /*.orderBy("createdAt", "desc")*/
  //     .limit(BATCH_GET_COUNT)
  //     .onSnapshot(snapshot => {
  //       const bookmarks: Array<Bookmark> = [];
  //       snapshot.forEach(doc => {
  //         const data = doc.data();
  //         bookmarks.push({
  //           id: doc.id,
  //           userId: userId,
  //           title: data.title,
  //           url: data.url,
  //           tags: getTagArray(data.tags).sort(),
  //           description: data.description,
  //           createdAt: data.createdAt.toDate()
  //         });
  //       });
  //       // whereで絞り込みをしながらorderByを行った場合、複合インデックスを作成する必要がある。
  //       // しかし、複数タグAND条件で絞り込みを行うために、タグは`{ tagA: true, tagB: true }`
  //       // の形式で保存している。そうすると複合インデックスを各タグと作成日時でそれぞれ作成しなければ
  //       // ならないので、今のところはローカルでソートする。ブックマークが増えて一回で取得する件数
  //       // が多くなったときにちゃんと考えないといけない。
  //       bookmarks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  //       callback(bookmarks);
  //     });
  // },
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
