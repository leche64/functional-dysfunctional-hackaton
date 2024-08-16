// import MovingButton from "./components/MovingButton";
import ZenQuote from "./components/ZenQuote";
import CursorEffect from "./components/CursorEffect";
import ZenCount from "./components/ZenCount";
import dynamic from "next/dynamic";
// import MovingCat from "./components/MovingCat";

const MovingButton = dynamic(() => import("./components/MovingButton"), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 retro-monitor">
      {/* <MovingCat /> */}
      <ZenCount />
      <CursorEffect/>
      <ZenQuote />
      <div className="loader"></div>
      <MovingButton />
    </main>
  );
}