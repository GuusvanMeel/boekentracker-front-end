
import BookSearchBar from "./components/BookSearchBar";
import SpinningWheel from "./components/SpinningWheel";


export default function Home() {
  
 return (
  <div className="flex flex-col gap-8">
    <BookSearchBar />
    <SpinningWheel />
  </div>
);}