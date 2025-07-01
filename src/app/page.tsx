import Image from "next/image";

export default function Home() {
  return (
    
      <div className="p-4 mt-8">
          <div className="flex flex-col items-center h-screen">
            <Image
              src="/img/nasa.png"
              alt="NASA Logo"
              width={400}
              height={200}
              className="mb-6"
            />
            <h1 className="text-3xl font-bold mb-4">NEO Web Service</h1>
            <p className="text-lg mb-6">Explore Near-Earth Objects (NEOs) with NASA's NEO Web Service.</p>
          
          </div>
      </div>
    
    
    
  );
}
