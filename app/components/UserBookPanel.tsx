import Image from 'next/image';
import { Book } from '../types/books';
export const UserBookPanel = ({ book }: {book : Book}) => {
  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
    : "public/globe.svg";
console.log(book);
  return (
    <div className="flex gap-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 w-64">
      {/* Cover Image */}
      <div className="shrink-0">
          <Image 
  src={coverUrl}
  alt={book.title}
  width={64}
  height={96}
  className="object-cover rounded"
/>
        
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 mb-1">
          {book.title ?? "niks"}
        </h3>
        
        <p className="text-xs text-slate-600 mb-1">
          {book.authors?? "niks"}
        </p>
        
        <p className="text-xs text-slate-500 mb-2">
          {book.publishYears?? "niks"}
        </p>

        {/* <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
          book.status === 'currently reading' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-orange-100 text-orange-700'
        }`}>
          {book.status === 'currently reading' ? 'Reading' : 'Stopped'}
        </span> */}
      </div>
    </div>
  );
};
