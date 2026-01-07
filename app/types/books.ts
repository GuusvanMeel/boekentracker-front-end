export type Book = {
  id: string;
  title: string;
  authors: string[];
  firstPublishYear: number | null;
  coverId: number | null;
  pageCount: number | null;
  languages: string[];
  publishers: string[];
  publishYears: number[];
  subjects: string[];
  ratingAverage: number | null;
  ratingCount: number | null;
  editionCount: number | null;
};