"use client";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
export default function AdminCategory() {
  const {
    categories,
    isLoading,
    isError,
    /* addCategory,
    renameCategory,
    deleteCategory,
    isAdding,
    isUpdating,
    isDeleting, */
    error,
  } = useBusinessCategories();
  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Error Categories: {error?.message ?? "Unknown error"}</div>;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Admin Category Page
      </h1>
      <p className="mb-1 text-lg">
        Ця сторінка призначена для СТВОРЕННЯ нової категорії адміном
      </p>

      <p className="italic">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
      <h2>Business Categories</h2>
      <ul>
        {categories?.map((category) => (
          <li key={category.categoryId}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}
