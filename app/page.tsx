
import Link from "next/link";
import BookSearchBar from "./components/BookSearchBar";
import SpinningWheel from "./components/SpinningWheel";


export default function Home() {
  
 return (
  <div className="flex flex-col gap-8">
    <BookSearchBar />
    <SpinningWheel />
    <div>
       <Link
         href="/LoveableAI"
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
        display: "inline-block",
        textDecoration: "none",
      }}
       >
         Go to New Design
       </Link>
    </div>
  </div>
);}