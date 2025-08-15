"use client";
import React, { useState } from "react";
import * as v from "valibot";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { categorySchema } from "@/lib/validators/categorySchema";
// export const categorySchema = v.object({
//   name: v.pipe(v.string(), v.nonEmpty("Введіть назву категорії")),
// });

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
  const [editState, setEditState] = useState<{
    id: string;
    name: string;
    editing: boolean;
  } | null>(null);

  const handleAdd = async () => {
    console.log("Adding category:", newName);
    const result = v.safeParse(categorySchema, { name: newName });
    if (!result.success) {
      alert(result.issues[0].message);
      return;
    }
    try {
      await addCategory({ name: newName });
      setNewName("");
    } catch (error) {
      alert("Помилка при додаванні категорії");
      console.log("Error adding category:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Error Categories: {error?.message ?? "Unknown error"}</div>;
  //------- Editing
  const startEditing = (id: string, currentName: string) => {
    if (id === "11111111-1111-1111-1111-111111111111") {
      alert('Увага! Це особлива категорія "Інше"');
    }
    // setEditStates(() => ({
    //   [id]: { editing: true, name: currentName },
    // }));
    setEditState({ id, name: currentName, editing: true });
  };
  //------- Cancel Editing
  const cancelEditing = () => {
    setEditState(null);
  };
  //------- Save Editing
  const saveEditing = async (id: string) => {
    if (!editState) return;
    const result = v.safeParse(categorySchema, { name: editState.name });
    if (!result.success) {
      alert(result.issues[0].message);
      return;
    }
    try {
      await renameCategory({ id, name: editState.name });
      setEditState(null);
    } catch {
      alert("Помилка при зміні назви категорії");
    }
  };
  // ----- Deleting
  const handleDelete = async (id: string) => {
    if (id === "11111111-1111-1111-1111-111111111111") {
      alert('Видалення категорії "Інше" заборонено');
      return;
    }
    if (!confirm("Видалити категорію?")) return;

    try {
      await deleteCategory(id);
    } catch {
      alert("Помилка при видаленні категорії");
    }
  };
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
          className={`border border-gray-500 p-2 rounded-md mb-8 ${
            isAdding ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="text"
          placeholder="Новая категория"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isAdding}
        />
        <button
          onClick={handleAdd}
          disabled={isAdding || !newName.trim()}
          className="cursor-pointer border border-green-500"
        >
          {isAdding ? "Додаємо..." : "Додати"}
        </button>
      </div>
      <ul>
        {categories.map(({ categoryId, name }) => {
          // const isEditing = editState?.editing || false;
          const isEditingCategory = editState?.id === categoryId || false;
          const editName = editState?.name || "";

          return (
            <li
              key={categoryId}
              style={{ marginBottom: 8 }}
              className="flex items-center gap-4"
            >
              {isEditingCategory ? (
                <>
                  <input
                    className={`border p-2 rounded-md opacity-50 cursor-not-allowed ${
                      isEditingCategory ? " border-gray-500 cursor-text" : ""
                    }`}
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditState(() => ({
                        id: categoryId,
                        name: e.target.value,
                        editing: true,
                      }))
                    }
                  />
                  <button
                    className="cursor-pointer border border-green-500"
                    onClick={() => saveEditing(categoryId)}
                    disabled={isUpdating}
                  >
                    Зберегти
                  </button>
                  <button
                    className="cursor-pointer border border-black"
                    onClick={() => cancelEditing()}
                    disabled={isUpdating}
                  >
                    Відміна
                  </button>
                </>
              ) : (
                <>
                  <span>{name}</span>
                  <button
                    onClick={() => startEditing(categoryId, name)}
                    className="cursor-pointer border border-green-500"
                  >
                    Редагувати
                  </button>
                  <button
                    className="cursor-pointer border border-red-500"
                    onClick={() => handleDelete(categoryId)}
                    disabled={
                      isDeleting
                      //we can make disabled by default for this category
                      // isDeleting ||
                      // categoryId === "11111111-1111-1111-1111-111111111111"
                    }
                  >
                    Видалити
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
      {error && <div style={{ color: "red" }}>Ошибка: {error.message}</div>}
      {/* <ul>
        {categories?.map((category) => (
          <li key={category.categoryId}>{category.name}</li>
        ))}
      </ul> */}
    </div>
  );
}
