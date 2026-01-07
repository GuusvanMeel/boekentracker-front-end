import { notFound } from "next/navigation";
import Link from "next/link";
import { Book } from "@/app/types/books";
import AddBookButton from "@/app/components/addbookbutton";



async function getBookDetails(workId: string): Promise<Book | null> {
  console.log("=== getBookDetails START ===");
  console.log("workId received:", workId);
  
  try {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/book-details/${workId}`;
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
  // Await params in Next.js 15+
  const { workId } = await params;
  const book = await getBookDetails(workId);

  if (!book) {
    notFound();
  }
  

  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
    : null;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <Link
        href="/"
        style={{ color: "#0066cc", textDecoration: "none", marginBottom: 20, display: "inline-block" }}
      >
        ← Back to search
      </Link>
      <AddBookButton book={book}></AddBookButton>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 40, marginTop: 20 }}>
        {/* Cover Image */}
        <div>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              style={{
                width: "100%",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "2/3",
                background: "#e5e7eb",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              No cover available
            </div>
          )}
        </div>

        {/* Book Details */}
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            {book.title}
          </h1>

          {book.authors.length > 0 && (
            <p style={{ fontSize: 20, color: "#6b7280", marginBottom: 20 }}>
              by {book.authors.join(", ")}
            </p>
          )}

          {/* Metadata Grid */}
          <div style={{ display: "grid", gap: 16, marginBottom: 32 }}>
            {book.firstPublishYear && (
              <div>
                <strong>First Published:</strong> {book.firstPublishYear}
              </div>
            )}

            {book.pageCount && (
              <div>
                <strong>Pages:</strong> {book.pageCount}
              </div>
            )}

            {book.editionCount && (
              <div>
                <strong>Editions:</strong> {book.editionCount}
              </div>
            )}

            {book.ratingAverage && book.ratingCount && (
              <div>
                <strong>Rating:</strong> {book.ratingAverage.toFixed(2)} ({book.ratingCount} ratings)
              </div>
            )}

            {book.languages.length > 0 && (
              <div>
                <strong>Languages:</strong> {book.languages.slice(0, 5).join(", ")}
                {book.languages.length > 5 && ` +${book.languages.length - 5} more`}
              </div>
            )}

            {book.publishers.length > 0 && (
              <div>
                <strong>Publishers:</strong> {book.publishers.slice(0, 3).join(", ")}
                {book.publishers.length > 3 && ` +${book.publishers.length - 3} more`}
              </div>
            )}
          </div>

          {/* Subjects */}
          {book.subjects.length > 0 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
                Subjects
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {book.subjects.slice(0, 15).map((subject, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "6px 12px",
                      background: "#f3f4f6",
                      borderRadius: 6,
                      fontSize: 14,
                      color: "#374151",
                    }}
                  >
                    {subject}
                  </span>
                ))}
                {book.subjects.length > 15 && (
                  <span style={{ padding: "6px 12px", color: "#6b7280", fontSize: 14 }}>
                    +{book.subjects.length - 15} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Link to OpenLibrary */}
          <div style={{ marginTop: 32 }}>
            <a
              href={`https://openlibrary.org${book.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                background: "#0066cc",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              View on Open Library →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}