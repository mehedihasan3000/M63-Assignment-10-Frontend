import Image from "next/image";
import HeroBanner from "@/components/HeroBanner";
import FeaturedSection from "@/components/FeaturedSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <HeroBanner />
      <FeaturedSection />
      <ContactSection />
    </div>
  );
}
