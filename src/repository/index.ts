import { firestore } from "@/firebaseApp";
import Bookmark from "@/models/Bookmark";
import Tag from "@/models/Tag";
import BookmarkFilter from "@/models/BookmarksFilter";

type DocumentSnapshot = firebase.firestore.DocumentSnapshot<
  firebase.firestore.DocumentData
>;

const db = firestore;
const BATCH_GET_COUNT = 30;
let lastBookmarkDoc: DocumentSnapshot | null;

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

/**
 * ブックマークを取得する
 *
 * @param userId ユーザーID
 */
async function getBookmarks(userId: string): Promise<Array<Bookmark>> {
  let query = db
    .collection(`users/${userId}/bookmarks`)
    .orderBy("createdAt", "desc")
    .limit(BATCH_GET_COUNT);

  if (lastBookmarkDoc) {
    query = query.startAfter(lastBookmarkDoc);
  }

  const snapshot = await query.get();

  const bookmarks: Array<Bookmark> = [];

  snapshot.forEach(doc => {
    bookmarks.push(docToModel(userId, doc));
    lastBookmarkDoc = doc;
  });

  return bookmarks;
}

/**
 * 指定のタグが全てついたブックマークを取得する
 *
 * @param userId ユーザーID
 * @param tags 絞込を行うタグ
 */
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

  // ブックマークが新規作成されてタグが登録されるまでタイムラグがあるので
  // 登録直後のタグは取得できないことがある。
  if (tagsSnapshot.size === 0) {
    return [];
  }

  // Firestoreではarray-contains-anyでAND検索はできないので、
  // 一番ブックマーク数が少ないタグがついたブックマークを拾い、
  // その中で他のタグも全て持っているブックマークに絞り込む。
  const minCountTag = tagsSnapshot.docs[0].data().tagName;
  const otherTags = tags.filter(t => t !== minCountTag);

  const bookmarks: Array<Bookmark> = [];

  const a = true;

  // 一回のクエリで取得するのはあくまで特定のタグ（ブックマーク数が一番少ない）
  // を持つブックマークなので、fetch外にまだ条件に合致するブックマークがある可能性が
  // あるので、ヒットしたブックマーク数がバッチ数に達するまで繰り返しfetchする。
  while (bookmarks.length < BATCH_GET_COUNT) {
    let query = db
      .collection(`users/${userId}/bookmarks`)
      .where("tags", "array-contains", minCountTag)
      .orderBy("createdAt", "desc")
      .limit(BATCH_GET_COUNT);

    if (lastBookmarkDoc) {
      query = query.startAfter(lastBookmarkDoc);
    }

    const snapshot = await query.get();

    if (snapshot.size === 0) {
      break;
    }

    snapshot.forEach(doc => {
      const tags = doc.data().tags;
      if (otherTags.every(t => tags.includes(t))) {
        bookmarks.push(docToModel(userId, doc));
      }
      lastBookmarkDoc = doc;
    });
  }

  return bookmarks;
}

export default class Repository {
  /**
   * ブックマーク取得
   *
   * @param userId ユーザーID
   * @param bookmarkId ブックマークID
   */
  static async getBookmark(
    userId: string,
    bookmarkId: string
  ): Promise<Bookmark> {
    const docRef = await db
      .doc(`users/${userId}/bookmarks/${bookmarkId}`)
      .get();

    if (!docRef.exists) {
      throw new Error(`Bookmark not found: ${bookmarkId}`);
    }

    return docToModel(userId, docRef);
  }

  /**
   * ブックマーク取得
   *
   * ページング有無にtrueをした場合、前回取得ブックマークの続きから取得する。
   *
   * @param userId ユーザーID
   * @param filter 絞込条件
   * @param pagination ページング有無
   */
  static async getBookmarks(
    userId: string,
    filter: BookmarkFilter,
    pagination: boolean = false
  ): Promise<Array<Bookmark>> {
    if (!pagination) {
      lastBookmarkDoc = null;
    }

    const hasTagFilter = filter.tags && filter.tags.length > 0;

    if (hasTagFilter) {
      return getTaggedBookmarks(userId, filter.tags);
    } else {
      return getBookmarks(userId);
    }
  }

  /**
   * ブックマーク追加
   *
   * @param bookmark ブックマーク
   */
  static async addBookmark(bookmark: Bookmark): Promise<void> {
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
  }

  static async editBookmark(bookmark: Bookmark): Promise<void> {
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
  }

  static async deleteBookmark(bookmark: Bookmark): Promise<void> {
    try {
      await db
        .collection(`users/${bookmark.userId}/bookmarks`)
        .doc(bookmark.id)
        .delete();
    } catch (error) {
      throw new Error(`Failed to delete bookmark: ${bookmark.id}`);
    }
  }

  static async getTag(userId: string, tagId: string): Promise<Tag> {
    try {
      const docRef = await db.doc(`users/${userId}/tags/${tagId}`).get();

      if (!docRef.exists) {
        throw new Error(`Tag not found: ${tagId}`);
      }

      const data = docRef.data();

      if (!data) {
        throw new Error("Failed to retrieve data");
      }

      return {
        id: docRef.id,
        tagName: data.tagName,
        bookmarkCount: data.bookmarkCount,
        createdAt: data.createdAt.toDate()
      };
    } catch (error) {
      throw new Error(`Failed to get tags`);
    }
  }

  static async getTags(userId: string): Promise<Array<Tag>> {
    try {
      const snapshot = await db
        .collection(`users/${userId}/tags`)
        .orderBy("tagName", "asc")
        // TODO Pagination
        .get();
      const tags = new Array<Tag>();

      snapshot.forEach(doc => {
        const data = doc.data();
        tags.push({
          id: doc.id,
          tagName: data.tagName,
          bookmarkCount: data.bookmarkCount,
          createdAt: data.createdAt.toDate()
        });
      });

      return tags;
    } catch (error) {
      throw new Error(`Failed to get tags`);
    }
  }

  static async editTag(userId: string, tag: Tag): Promise<void> {
    try {
      const docRef = db.doc(`users/${userId}/tags/${tag.id}`);

      await docRef.update({
        tagName: tag.tagName
      });
    } catch (error) {
      throw new Error(`Failed to edit tag: ${error}`);
    }
  }

  static onTagsChange(
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
}
