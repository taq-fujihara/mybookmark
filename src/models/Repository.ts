import Bookmark from "./Bookmark";

interface Repository {
  // getBookmarks(userId: string): Promise<Array<Bookmark>>;
  getBookmark(userId: string, bookmarkId: string): Promise<Bookmark>;
  addBookmark(bookmark: Bookmark): Promise<void>;
  editBookmark(bookmark: Bookmark): Promise<void>;
  deleteBookmark(bookmark: Bookmark): Promise<void>;
  onBookmarksUpdated(callback: (bookmarks: Array<Bookmark>) => void): void;
}

export default Repository;
