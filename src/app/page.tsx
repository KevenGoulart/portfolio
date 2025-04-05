import CombinedScene from "@/components/foreground";

export default function Home() {
  return (
    <div className="relative w-screen h-screen bg-[url('/galaxy.png')] bg-cover bg-center">
      <CombinedScene />
    </div>
  );
}
