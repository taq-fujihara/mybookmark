type Bookmark = {
  id: string;
  userId: string;
  title: string;
  url: string;
  tags: Array<string>;
  description: string;
  createdAt: Date;
};

export default Bookmark;
