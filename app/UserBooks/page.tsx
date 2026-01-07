import { UserBookPanel } from "../components/UserBookPanel";

export default async function Page() {
  const userId = "695e85848d9557eaebf75dba"; // fixed for now
  
  // 1. Get user's books
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-books?userId=${userId}`,
    { cache: "no-store" }
  );
  
  if (!res.ok) {
    const text = await res.text();
    return <pre>Failed: {res.status} {text}</pre>;
  }
  
  const data = await res.json();
  
  // 2. Fetch book details for each entry
  const booksWithDetails = await Promise.all(
    data.items.map(async (userBook: any) => {
      const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/book-details${userBook.bookKey}`;
      console.log("Fetching URL:", url);
      
      const response = await fetch(url, { cache: "no-store" });
      
      if (!response.ok) {
        console.error(`Failed to fetch book details for ${userBook.bookKey}`);
        return null;
      }
      
      const { book } = await response.json();
      
      if (!book) {
        return null;
      }
      
      // 3. Combine user book data with book details
      return {
        title: book.title,
        authorName: book.authors,
        firstPublishYear: book.firstPublishYear ? [book.firstPublishYear] : [],
        coverId: book.coverId,
        status: userBook.status, // from user-books data
      };
    })
  );
  console.log("These are the books" + booksWithDetails)
  // Filter out any null results
  const validBooks = booksWithDetails.filter(book => book !== null);
  
  // 4. Render all books
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Book Collection</h1>
      <div className="flex flex-wrap gap-4">
        {validBooks.map((book, index) => (
          <UserBookPanel key={index} book={book} />
        ))}
      </div>
      {validBooks.length === 0 && (
        <p className="text-gray-500">No books in your collection yet</p>
      )}
    </div>
  );
}