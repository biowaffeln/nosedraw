import DrawSection from "../components/draw-section";

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 font-sans">
      <header className="py-5 text-center mb-10">
        <h1 className="text-4xl md:text-5xl mb-2 font-bold leading-tight">
          Welcome to Nosedraw!
        </h1>
        <p className="text-2xl max-w-xs mx-auto md:max-w-full leading-tight">
          the website that lets you draw with your nose
        </p>
      </header>
      <div>
        <DrawSection />
      </div>
    </div>
  );
}
