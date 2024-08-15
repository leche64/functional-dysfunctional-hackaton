import MovingButton from "./components/MovingButton";
import ZenQuote from "./components/ZenQuote";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <ZenQuote />
      <MovingButton />
    </main>
  );
}