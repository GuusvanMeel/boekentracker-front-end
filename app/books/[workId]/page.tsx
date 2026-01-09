import { notFound } from "next/navigation";
import Image from "next/image";
import { Book } from "@/app/types/books";
import AddBookButton from "@/app/components/addbookbutton";
import { ChevronLeft } from "lucide-react";
import BackToHomeButton from "@/app/components/BackToHomeButton";

export async function getBookDetails(workId: string): Promise<Book | null> {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/book-details/${workId}`;
    console.log("Fetching URL:", url);

    const response = await fetch(url, { cache: "no-store" });
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      console.log("Response not OK, returning null");
      return null;
    }

    const data = await response.json();
    console.log("Data received:", data);
    console.log("Book from data:", data.book);
    return data.book;
  } catch (error) {
    console.error("Failed to fetch book - ERROR:", error);
    return null;
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const { workId } = await params;
  const book = await getBookDetails(workId);

  if (!book) notFound();

  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
    : null;

  // Safe fallbacks
  const authors =
    book.authors?.length && book.authors.length > 0
      ? book.authors.join(", ")
      : "Onbekende auteur";

  const genres = (book.genres ?? []).slice(0, 8); // keep it tidy
  const description = book.description ?? "Geen beschrijving beschikbaar.";

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <BackToHomeButton></BackToHomeButton>
        <AddBookButton book={book}></AddBookButton>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-4">
        {/* Cover header */}
        <div className="bg-linear-to-r from-cyan-400 to-blue-400 p-6 pb-20">
          <div className="w-44 h-64 mx-auto rounded-xl shadow-2xl bg-white/20 backdrop-blur-sm overflow-hidden flex items-center justify-center">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={book.title}
                width={176}
                height={256}
                className="object-cover w-full h-full"
                priority
              />
            ) : (
              <div className="text-white font-bold text-xl">No cover</div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 -mt-12 pb-6">
          {/* Title + meta */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {book.title}
            </h1>

            <p className="text-blue-600 mb-3">{authors}</p>

            {genres.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {genres.map((subject) => (
                  <span
                    key={subject}
                    className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-lg text-xs font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status block (still placeholder data unless you have it) */}
          <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl p-5 mb-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-800">Leesstatus</span>

              {/* Replace these when you have real status in your DB */}
              <span className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">
                Aan het lezen
              </span>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Startdatum</p>
                <p className="font-bold text-green-700">—</p>
              </div>
              <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Einddatum</p>
                <p className="font-bold text-gray-400">—</p>
              </div>
            </div>

            <button className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl py-3 font-bold shadow-md">
              Markeer als uitgelezen
            </button>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-4">
            <h3 className="font-bold text-gray-800 mb-2">Over dit boek</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Details grid */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">Boek Details</h3>

            <div className="grid grid-cols-2 gap-3">
              {book.pageCount ? (
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Pagina&apos;s</p>
                  <p className="font-bold text-cyan-600">
                    {book.pageCount}
                  </p>
                </div>
              ) : null}

              {book.publishYear ? (
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Jaar</p>
                  <p className="font-bold text-blue-600">
                    {book.publishYear}
                  </p>
                </div>
              ) : null}

              {book.publisher ? (
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Uitgever</p>
                  <p className="font-bold text-indigo-600 text-sm">
                    {book.publisher}
                  </p>
                </div>
              ) : null}

              {book.isbn ? (
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">ISBN</p>
                  <p className="font-bold text-purple-600 text-xs">
                    {book.isbn}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}
