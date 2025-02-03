import { Polaroid } from "./components/Polaroid";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="min-h-screen">
        <Polaroid />
      </main>
    </>
  );
}
