import Image from "next/image";
import HeroBanner from "@/components/HeroBanner";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <HeroBanner />
    </div>
  );
}
