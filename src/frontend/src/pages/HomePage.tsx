import { CollectionsGrid } from "@/components/home/CollectionsGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { LadakhMapSection } from "@/components/home/LadakhMapSection";
import { PhilosophySection } from "@/components/home/PhilosophySection";
import { SpiritualSymbolsSection } from "@/components/home/SpiritualSymbolsSection";
import { StorySection } from "@/components/home/StorySection";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <PhilosophySection />
      <CollectionsGrid />
      <StorySection />
      <SpiritualSymbolsSection />
      <LadakhMapSection />
    </main>
  );
}
