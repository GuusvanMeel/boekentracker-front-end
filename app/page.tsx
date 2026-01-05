import SpinningWheel from "./components/SpinningWheel";


export default function Home() {
  const data=['Guus', 'Pim', 'Emma', 'maarten', 'test', 'iets', 'yessir', 'ijdsakjs']; 
  return (
    <div>
<SpinningWheel options={data}></SpinningWheel>
    </div>
  );
}
