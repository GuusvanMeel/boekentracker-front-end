"use client"
import { Book } from '../types/books';

export default function AddBookButton({book}:{book : Book}) {
  const handleAddToCollection = async () => {

  // 2) Add book to user's list with status READING
  const userBookRes = await fetch("/api/user-books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "695e6dd0c7f71481c4d1db25",
      bookKey: book.id,
      status: "READING",
    }),
  });

  if (!userBookRes.ok) {
    console.error(await userBookRes.json());
    alert("Failed to add book to your list");
    return;
  }

  alert("Book added to your collection!");
};

    return (
<div>
  <button
    onClick={handleAddToCollection}
    style={{
      padding: "0.75rem 1.25rem",
      borderRadius: "0.5rem",
      backgroundColor: "#2563eb", // blue-600
      color: "white",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.35)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.45)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(37, 99, 235, 0.35)";
    }}
  >
    Add book to collection
  </button>
</div>
  )
}
