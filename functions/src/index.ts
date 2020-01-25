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
        .then(snapshot =>
          db.doc(`users/${userId}/tags/${tag}`).set(
            {
              bookmarkCount: snapshot.size,
              tagName: tag
            },
            { merge: true }
          )
        )
    );

    await Promise.all(updates);
  });

export const updateTag = functions.firestore
  .document("users/{userId}/tags/{tagId}")
  .onCreate(snapshot => snapshot.ref.update({ createdAt: new Date() }));

export const archiveTag = functions.firestore
  .document("users/{userId}/bookmarks/{bookmarkId}")
  .onDelete(async (snapshot, context) => {
    const userId = context.params.userId;
    const bookmarkId = context.params.bookmarkId;

    await db.doc(`users/${userId}/archivedBookmarks/${bookmarkId}`).set({
      ...snapshot.data()
    });
  });
