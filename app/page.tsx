import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Disciplines } from "@/components/sections/Disciplines";
import { Hero } from "@/components/sections/Hero";
import { Interlude } from "@/components/sections/Interlude";
import { NetworkLab } from "@/components/sections/NetworkLab";
import { Projects } from "@/components/sections/Projects";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Interlude />
      <Disciplines />
      <NetworkLab />
      <Projects />
      <About />
      <Contact />
    </>
  );
}
