import Logo from "@/components/icons/Logo";
import LogoMonochrome from "@/components/icons/LogoMonochrome";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen dark bg-neutral-800 flex-col items-center justify-between p-24">
      <Logo />
      <LogoMonochrome />
    </main>
  );
}
