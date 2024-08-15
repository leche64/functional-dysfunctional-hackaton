import MovingButton from "./components/MovingButton";
import ZenQuote from "./components/ZenQuote";
import CursorEffect from "./components/CursorEffect";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <CursorEffect/>
      <ZenQuote />
      <MovingButton />
    </main>
  );
}