import SpinningWheel from "./components/SpinningWheel";


export default function Home() {
  const data=['The Hobbit', 'Pim', 'Emma', 'maarten', 'test', 'iets', 'yessir', 'ijdsakjs', 'Pim', 'Emma', 'maarten', 'test', 'iets', 'yessir', 'ijdsakjs', 'Pim', 'Emma', 'The Shining', 'test', 'The Shining', 'yessir', 'ijdsakjs', 'Pim', 'Emma', 'maarten', 'test', 'The Shining', 'yessir', 'ijdsakjs']; 
  return (
    <div>
<SpinningWheel options={data}></SpinningWheel>
    </div>
  );
}
