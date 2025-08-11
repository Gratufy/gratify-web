"use client";
import React, { useState } from "react";
import * as v from "valibot";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";

export const categorySchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Введіть назву категорії")),
});

export default function AdminCategory() {
  const {
    categories,
    isLoading,
    isError,
    addCategory,
    renameCategory,
    deleteCategory,
    isAdding,
    isUpdating,
    isDeleting,
    error,
  } = useBusinessCategories();

  const [newName, setNewName] = useState("");
  const [editStates, setEditStates] = useState<
    Record<string, { editing: boolean; name: string }>
  >({});

  const handleAdd = async () => {
    console.log("Adding category:", newName);
    const result = v.safeParse(categorySchema, { name: newName });
    if (!result.success) {
      alert(result.issues[0].message);
      return;
    }
    try {
      await addCategory(newName);
      setNewName("");
    } catch (e) {
      alert("Помилка при додаванні категорії");
    }
  };

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
      <div>
        <input
          type="text"
          placeholder="Новая категория"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isAdding}
        />
        <button onClick={handleAdd} disabled={isAdding || !newName.trim()}>
          {isAdding ? "Додаємо..." : "Додати"}
        </button>
      </div>
      <ul>
        {categories?.map((category) => (
          <li key={category.categoryId}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}
