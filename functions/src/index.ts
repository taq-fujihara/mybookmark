import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();
const db = admin.firestore();

export const updateTagOnBookmarkWrite = functions.firestore
  .document("users/{userId}/bookmarks/{bookmarkId}")
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const tagsBefore = change.before.data() ? change.before.data()!.tags : [];
    const tagsAfter = change.after.data() ? change.after.data()!.tags : [];
    const tagsInvolved: Array<string> = Array.from(
      new Set([...tagsBefore, ...tagsAfter])
    );

    const updates = tagsInvolved.map(tag =>
      db
        .collection(`users/${userId}/bookmarks`)
        .where("tags", "array-contains", tag)
        .get()
        .then(snapshot => {
          const bookmarkCount = snapshot.size;

          if (bookmarkCount === 0) {
            return db.doc(`users/${userId}/tags/${tag}`).delete();
          } else {
            return db.doc(`users/${userId}/tags/${tag}`).set(
              {
                bookmarkCount,
                tagName: tag
              },
              { merge: true }
            );
          }
        })
    );

    await Promise.all(updates);
  });

export const setCreationTimeOnTag = functions.firestore
  .document("users/{userId}/tags/{tagId}")
  .onCreate(snapshot => {
    const data = snapshot.data();
    if (!data) {
      return;
    }
    if (data.createdAt) {
      return;
    }
    return snapshot.ref.update({ createdAt: new Date() });
  });

export const updateTag = functions.firestore
  .document("users/{userId}/tags/{tagId}")
  .onUpdate(async (change, context) => {
    const dataBefore = change.before.data();
    const dataAfter = change.after.data();

    if (!dataBefore || !dataAfter) {
      throw new Error(
        `data empty: ${context.params.userId}, ${context.params.tagId}`
      );
    }

    if (dataBefore.tagName === dataAfter.tagName) {
      return;
    }

    await db
      .doc(`users/${context.params.userId}/tags/${dataAfter.tagName}`)
      .set({
        ...dataAfter
      });

    // remove old tag
    await db
      .doc(`users/${context.params.userId}/tags/${dataBefore.tagName}`)
      .delete();

    // update bookmarks
    const snapshot = await db
      .collection(`users/${context.params.userId}/bookmarks`)
      .where("tags", "array-contains", dataBefore.tagName)
      .get();

    snapshot.forEach(async doc => {
      const data = doc.data();

      if (!data) {
        return;
      }

      const newTags = [
        ...data.tags.filter((t: string) => t !== dataBefore.tagName),
        dataAfter.tagName
      ];

      await doc.ref.update({ tags: newTags });
    });
  });

export const archiveBookmark = functions.firestore
  .document("users/{userId}/bookmarks/{bookmarkId}")
  .onDelete(async (snapshot, context) => {
    const userId = context.params.userId;
    const bookmarkId = context.params.bookmarkId;

    await db.doc(`users/${userId}/archivedBookmarks/${bookmarkId}`).set({
      ...snapshot.data()
    });
  });

export const metaInfo = functions.https.onCall(async data => {
  const url = data.url;
  if (!url) {
    throw new Error("url is required");
  }

  const axios = await import("axios");
  const { load } = await import("cheerio");

  const content = await axios.default.get(url);
  const $ = load(content.data);

  const meta = {
    title: "",
    description: "",
    image: ""
  };

  $('meta[property^="og:"]').each((i, elem) => {
    const $$ = $(elem);
    if ($$.attr("property") === "og:title") {
      meta.title = $$.attr("content") || "";
    }
    if ($$.attr("property") === "og:description") {
      meta.description = $$.attr("content") || "";
    }
    if ($$.attr("property") === "og:image") {
      meta.image = $$.attr("content") || "";
    }
  });

  return meta;
});
