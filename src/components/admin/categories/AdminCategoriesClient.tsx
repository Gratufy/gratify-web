'use client';
import React, { useState } from 'react';
import * as v from 'valibot';
import IconCategory from '@/assets/icons/menu/icon-category.svg';
import { categorySchema } from '@/lib/validators/categorySchema';

import { useBusinessCategories } from '@/hooks/useBusinessCategories';

import { CheckIcon } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';
import AdminSkeleton from '@/components/admin/shared/AdminSkeleton';
import { Label } from '@/components/ui/label';

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
  // const [openInput, setOpenInput] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [editState, setEditState] = useState<{
    id: string;
    name: string;
    editing: boolean;
  } | null>(null);

  const handleAdd = async () => {
    const result = v.safeParse(categorySchema, { name: newName });
    if (!result.success) {
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">{result.issues[0].message}</p>
          </>
        ),
      });
      return;
    }
    try {
      await addCategory({ name: newName });
      CustomToast({
        type: 'success',
        content: (
          <>
            <p className="font-semibold">Категорію створено</p>
          </>
        ),
      });
      setNewName('');
    } catch (error) {
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">Помилка при додаванні категорії</p>
          </>
        ),
      });
      console.log('Error adding category:', error);
    }
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (isError)
  //   return <div>Error Categories: {error?.message ?? 'Unknown error'}</div>;
  //------- Editing
  const startEditing = (id: string, currentName: string) => {
    if (id === '11111111-1111-1111-1111-111111111111') {
      CustomToast({
        type: 'warning',
        content: (
          <>
            <p className="font-semibold">
              Увага! Це особлива категорія &ldquo;Інше&rdquo;
            </p>
          </>
        ),
      });
    }

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
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">{result.issues[0].message}</p>
          </>
        ),
      });
      return;
    }
    try {
      await renameCategory({ id, name: editState.name });
      setEditState(null);
    } catch {
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">Помилка при зміні назви категорії</p>
          </>
        ),
      });
    }
  };
  // ----- Deleting
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        CustomToast({
          type: 'success',
          content: (
            <>
              <p className="font-semibold">{`Категорію видалено.`}</p>
              <p className="font-semibold">
                {` В ${res.reassignedCount} бізнесів змінено категорію на "Інше".`}
              </p>
            </>
          ),
        });
      }
    } catch (error) {
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">Помилка при видаленні категорії</p>
          </>
        ),
      });
      console.error('Error deleting category:', error);
    }
  };
  return (
    <div className="max-[1024px]:max-w-150 w-full flex-col max-[1024px]:mx-auto lg:flex">
      {/*  mobile nav title */}
      <div className="bg-background-main-100 flex items-center justify-center gap-3 py-3 lg:hidden">
        <IconCategory className="size-5" />
        <span className="title-h4">Модерування</span>
      </div>
      {/*  section */}
      <div className="bg-background-white w-full flex-col items-center max-[1024px]:px-4 max-[1024px]:pb-6 max-[1024px]:pt-8 lg:my-3 lg:px-[50px] lg:py-10">
        <div className="mb-10 flex flex-col gap-4">
          <p className="placeholder-sm xl:placeholder-base">Додати категорію</p>
          <Label className="sr-only" htmlFor="new-category-name">
            Назва категорії
          </Label>

          <input
            id="new-category-name"
            className={`input-custom w-full px-4 lg:w-2/3 ${
              isAdding ? 'cursor-not-allowed opacity-50' : ''
            }`}
            //   className="input-custom"
            type="text"
            placeholder="Назва категорії"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={isAdding}
          />
          <div className="flex w-full justify-between lg:w-2/3">
            <button
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
              className="btn-aprove title-h6 bg- w-fit px-5 py-2 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Створюємо...' : 'Створити категорію'}
            </button>
            <button
              // onClick={() => setOpenInput(false)}
              onClick={() => setNewName('')}
              className="btn-reject title-h6 w-fit px-5 py-2 disabled:cursor-not-allowed"
              disabled={isAdding || !newName.trim()}
            >
              Очистити
            </button>
          </div>
          {/* )} */}
        </div>
        {isLoading && <AdminSkeleton count={7} />}
        {isError && (
          <div className="placeholder-sm xl:placeholder-base text-center">
            Ошибка: {error?.message}
          </div>
        )}
        {categories.length > 0 && (
          <ul>
            {categories.map(({ categoryId, name }) => {
              // const isEditing = editState?.editing || false;
              const isEditingCategory = editState?.id === categoryId || false;
              const editName = editState?.name || '';

              return (
                <li
                  key={categoryId}
                  //   lg:w-[558px]
                  className="border-b-elements-grey-400 mb-3 flex w-full items-center justify-between border-b px-4 py-2"
                >
                  {isEditingCategory ? (
                    <>
                      <input
                        className={`cursor-not-allowed p-2 opacity-90 ${
                          isEditingCategory
                            ? 'text-text-800-grey border-b-text-500-grey mr-8 w-full cursor-text border-b px-0 outline-none'
                            : ''
                        }`}
                        type="text"
                        minLength={5}
                        maxLength={60}
                        value={editName}
                        onChange={(e) =>
                          setEditState(() => ({
                            id: categoryId,
                            name: e.target.value,
                            editing: true,
                          }))
                        }
                      />
                      <div className="flex gap-4 lg:gap-4 xl:gap-8">
                        <button
                          className="btn-custom bg-background-white border border-green-500 p-2"
                          onClick={() => saveEditing(categoryId)}
                          disabled={isUpdating}
                        >
                          <CheckIcon className="size-6" />
                        </button>
                        <button
                          className="btn-custom border-elements-grey-950 border p-2"
                          onClick={() => cancelEditing()}
                          disabled={isUpdating}
                        >
                          <CrossIcon className="size-6" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="title-h6">{name}</span>
                      <div className="flex gap-4 lg:gap-4 xl:gap-8">
                        <button
                          onClick={() => startEditing(categoryId, name)}
                          className="btn-custom border-none p-2"
                        >
                          <EditPen className="size-6" />
                        </button>
                        <button
                          className="btn-custom border-none p-2"
                          onClick={() => {
                            if (
                              categoryId ===
                              '11111111-1111-1111-1111-111111111111'
                            ) {
                              //   alert('Видалення категорії "Інше" заборонено');
                              CustomToast({
                                type: 'info',
                                content: (
                                  <>
                                    <p className="font-semibold">
                                      Видалення категорії &ldquo;Інше&rdquo;
                                      заборонено
                                    </p>
                                  </>
                                ),
                              });
                              return;
                            }
                            setDeleteCategoryId(categoryId);
                            setDialogOpen(true);
                          }}
                          disabled={
                            isDeleting
                            //we can make disabled by default for this category
                            // isDeleting ||
                            // categoryId === "11111111-1111-1111-1111-111111111111"
                          }
                        >
                          <IconRecycle className="text-text-warning size-6" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {categories.length === 0 && !isLoading && !isError && (
          <div className="placeholder-sm xl:placeholder-base text-center">
            Немає створених категорій.
          </div>
        )}
        {deleteCategoryId && (
          <CustomAlertDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Ви впевнені, що хочете видалити цю категорію?"
            actionContent="Видалити"
            cancelText="Скасувати"
            classNameTitle="text-center xl:placeholder-base! placeholder-sm! font-normal"
            classNameDescription="text-center text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
            onAction={() => handleDelete(deleteCategoryId)}
            //  setOnConfirm(() => () => removeFavorite.mutate(business.id));
          />
        )}
      </div>
    </div>
  );
}

export default AdminCategoriesClient;
