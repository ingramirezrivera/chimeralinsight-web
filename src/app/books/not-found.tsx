// src/app/books/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-[50vh] grid place-items-center text-center p-10">
      <div>
        <h1 className="text-3xl font-bold">Book not found</h1>
        <p className="mt-2 text-neutral-600">
          Please check the URL or go back.
        </p>
      </div>
    </div>
  );
}
