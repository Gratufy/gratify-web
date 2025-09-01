'use client';
import React from 'react';

type CategoryFilterProps = {
  categoryId: string;
  setCategoryId: (id: string) => void;
  categories: { categoryId: string; name: string }[];
};

function CategoryFilter({
  categoryId,
  setCategoryId,
  categories,
}: CategoryFilterProps) {
  return (
    <div>
      <h3>Category Filter</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.categoryId}>
            <label>
              <input
                type="radio"
                name="category"
                checked={categoryId === category.categoryId}
                onChange={() => setCategoryId(category.categoryId)}
              />
              {category.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryFilter;
