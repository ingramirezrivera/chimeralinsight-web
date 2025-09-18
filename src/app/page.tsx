import Link from "next/link";
// Ya no necesitas importar el Navbar aquí

export default function Home() {
  return (
    <main className="container mx-auto p-8 text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mt-16 mb-4 dark:text-white">
        Bienvenido a chimeralinsight
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Tu página de inicio está lista para ser construida.
      </p>
    </main>
  );
}
