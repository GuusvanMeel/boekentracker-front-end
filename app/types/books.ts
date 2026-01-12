export type Book = {
  id: string;

  title: string;
  authors: string[];

  description: string | null;

  coverId: number | null;

  isbn: string | null;
  pageCount: number | null;

  publishYear: number | undefined;
  publisher: string | null;

  genres: string[];
};