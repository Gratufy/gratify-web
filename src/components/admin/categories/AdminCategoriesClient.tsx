'use client';
import React, { useState } from 'react';
import * as v from 'valibot';
import { Plus } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import { CheckIcon } from 'lucide-react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { categorySchema } from '@/lib/validators/categorySchema';

function AdminCategoriesClient() {
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
  const [openInput, setOpenInput] = useState(false);
  console.log('openInput', openInput);
  const [newName, setNewName] = useState('');
  const [editState, setEditState] = useState<{
    id: string;
    name: string;
    editing: boolean;
  } | null>(null);

  const handleAdd = async () => {
    const result = v.safeParse(categorySchema, { name: newName });
    if (!result.success) {
      alert(result.issues[0].message);
      return;
    }
    try {
      await addCategory({ name: newName });
      setNewName('');
    } catch (error) {
      alert('Помилка при додаванні категорії');
      console.log('Error adding category:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Error Categories: {error?.message ?? 'Unknown error'}</div>;
  //------- Editing
  const startEditing = (id: string, currentName: string) => {
    if (id === '11111111-1111-1111-1111-111111111111') {
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
      alert('Помилка при зміні назви категорії');
    }
  };
  // ----- Deleting
  const handleDelete = async (id: string) => {
    if (id === '11111111-1111-1111-1111-111111111111') {
      alert('Видалення категорії "Інше" заборонено');
      return;
    }
    if (!confirm('Видалити категорію?')) return;

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        alert(
          `Категорію видалено. Перепризначено бізнесів: ${res.reassignedCount}`
        );
      }
    } catch {
      alert('Помилка при видаленні категорії');
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-col lg:mb-10 lg:gap-4">
        <button
          className="btn-aprove w-50 title-h6"
          type="button"
          onClick={() => setOpenInput(!openInput)}
        >
          {openInput ? (
            'Зачинити'
          ) : (
            <>
              <Plus className="lg:size-4" /> <span>Додати категорію</span>
            </>
          )}
        </button>
        {openInput && (
          <>
            <input
              className={`input-custom px-4 ${
                isAdding ? 'cursor-not-allowed opacity-50' : ''
              }`}
              //   className="input-custom"
              type="text"
              placeholder="Назва категорії"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isAdding}
            />
            <div className="flex justify-between">
              <button
                onClick={handleAdd}
                disabled={isAdding || !newName.trim()}
                className="btn-aprove title-h6 bg- w-fit px-5 py-2 disabled:cursor-not-allowed"
              >
                {isAdding ? 'Створюємо...' : 'Створити категорію'}
              </button>
              <button
                onClick={() => setOpenInput(false)}
                className="btn-reject title-h6 w-fit px-5 py-2 disabled:cursor-not-allowed"
                disabled={isAdding}
              >
                Скасувати
              </button>
            </div>
          </>
        )}
      </div>
      <ul>
        {categories.map(({ categoryId, name }) => {
          // const isEditing = editState?.editing || false;
          const isEditingCategory = editState?.id === categoryId || false;
          const editName = editState?.name || '';

          return (
            <li
              key={categoryId}
              style={{ marginBottom: 8 }}
              //   lg:w-[558px]
              className="lg:border-b-elements-grey-400 flex w-full items-center lg:justify-between lg:border-b lg:px-4 lg:py-2"
            >
              {isEditingCategory ? (
                <>
                  <input
                    className={`cursor-not-allowed p-2 opacity-50 ${
                      isEditingCategory
                        ? 'text-text-800-grey border-b-text-500-grey mr-8 w-full cursor-text border-b px-0 outline-none'
                        : ''
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
                  <div className="flex lg:gap-4">
                    <button
                      className="cursor-pointer border border-green-500 p-2 disabled:cursor-not-allowed"
                      onClick={() => saveEditing(categoryId)}
                      disabled={isUpdating}
                    >
                      <CheckIcon className="lg:size-6" />
                    </button>
                    <button
                      className="cursor-pointer border border-black p-2 disabled:cursor-not-allowed"
                      onClick={() => cancelEditing()}
                      disabled={isUpdating}
                    >
                      <CrossIcon className="lg:size-6" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="title-h6">{name}</span>
                  <div className="flex lg:gap-4">
                    <button
                      onClick={() => startEditing(categoryId, name)}
                      className="cursor-pointer border-none p-2"
                    >
                      <EditPen className="lg:size-6" />
                    </button>
                    <button
                      className="cursor-pointer border-none p-2"
                      onClick={() => handleDelete(categoryId)}
                      disabled={
                        isDeleting
                        //we can make disabled by default for this category
                        // isDeleting ||
                        // categoryId === "11111111-1111-1111-1111-111111111111"
                      }
                    >
                      <IconRecycle className="lg:size-6" />
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
      {error && <div style={{ color: 'red' }}>Ошибка: {error.message}</div>}
      {/* <ul>
        {categories?.map((category) => (
          <li key={category.categoryId}>{category.name}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default AdminCategoriesClient;
