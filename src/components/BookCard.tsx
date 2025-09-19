import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
  title: string;
  imageUrl: string;
  amazonUrl: string;
}

export default function BookCard({
  title,
  imageUrl,
  amazonUrl,
}: BookCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Tarjeta del libro */}
      <div className="w-52 h-auto rounded-lg shadow-xl overflow-hidden bg-surface">
        <Image
          src={imageUrl}
          alt={title}
          width={200}
          height={300}
          className="w-full h-auto object-cover"
        />
        <div className="p-4 flex flex-col items-center">
          <h3 className="text-lg font-bold text-fg text-center mt-2 mb-4">
            {title}
          </h3>
          <Link href={amazonUrl} className="btn btn-primary" legacyBehavior>
            <a className="w-full text-center">Buy Now</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
