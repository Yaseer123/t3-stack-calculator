"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface Subcategory {
  id: number;
  name: string;
  categoryId: number | null;
}

export default function CategoryForm() {
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{
    id: number;
    name: string;
    categoryId: number;
  } | null>(null);

  const utils = api.useUtils();
  const { data: categories = [], refetch } = api.category.getAll.useQuery();

  const addCategory = api.category.create.useMutation({
    onSuccess: () => {
      utils.category.invalidate();
      setCategoryName("");
      refetch();
    },
  });

  const addSubcategory = api.subcategory.create.useMutation({
    onSuccess: () => {
      utils.category.invalidate();
      setSubcategoryName("");
      setSelectedCategoryId(null);
      refetch();
    },
  });

  const updateCategory = api.category.update.useMutation({
    onSuccess: () => {
      utils.category.invalidate();
      setEditingCategory(null);
      refetch();
    },
  });

  const updateSubcategory = api.subcategory.update.useMutation({
    onSuccess: () => {
      utils.category.invalidate();
      setEditingSubcategory(null);
      setSelectedCategoryId(null);
      setSubcategoryName("");
      refetch();
    },
  });

  const handleAddOrUpdateCategory = () => {
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, name: categoryName });
    } else {
      addCategory.mutate({ name: categoryName });
    }
    setCategoryName("");
    setEditingCategory(null);
  };

  const handleAddOrUpdateSubcategory = () => {
    if (editingSubcategory) {
      updateSubcategory.mutate({
        id: editingSubcategory.id,
        name: subcategoryName,
        categoryId: selectedCategoryId!,
      });
    } else {
      addSubcategory.mutate({
        name: subcategoryName,
        categoryId: selectedCategoryId!,
      });
    }
    setSubcategoryName("");
    setEditingSubcategory(null);
    setSelectedCategoryId(null);
  };

  return (
    <div className="grid gap-6 p-4 md:p-8">
      {/* Add or Edit Category */}
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {editingCategory ? "Edit Category" : "Add a New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddOrUpdateCategory}>
            {editingCategory ? "Update Category" : "Add Category"}
          </Button>
        </CardFooter>
      </Card>

      {/* Add or Edit Subcategory */}
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {editingSubcategory ? "Edit Subcategory" : "Add a Subcategory"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(value) => {
              setSelectedCategoryId(Number(value));
              if (editingSubcategory) {
                setEditingSubcategory({
                  ...editingSubcategory,
                  categoryId: Number(value),
                });
              }
            }}
            value={
              editingSubcategory
                ? editingSubcategory.categoryId?.toString() || ""
                : selectedCategoryId?.toString() || ""
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            placeholder="Enter subcategory name"
            className="mt-4 w-full"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddOrUpdateSubcategory}>
            {editingSubcategory ? "Update Subcategory" : "Add Subcategory"}
          </Button>
        </CardFooter>
      </Card>

      {/* Display Categories with Subcategories */}
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        {categories.map((cat) => (
          <Card key={cat.id} className="w-full">
            <CardHeader>
              <CardTitle>
                {cat.name}
                <Button
                  onClick={() => {
                    setEditingCategory(cat);
                    setCategoryName(cat.name);
                  }}
                  className="ml-4"
                  variant="ghost"
                >
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-md font-semibold">Subcategories</h3>
              {cat.subcategories && cat.subcategories.length > 0 ? (
                <ul className="list-disc pl-5">
                  {cat.subcategories.map((sub: Subcategory) => (
                    <li key={sub.id} className="flex items-center gap-2">
                      {sub.name}
                      <Button
                        onClick={() => {
                          setEditingSubcategory({
                            id: sub.id,
                            name: sub.name,
                            categoryId: sub.categoryId!,
                          });
                          setSubcategoryName(sub.name);
                          setSelectedCategoryId(sub.categoryId);
                        }}
                        className="ml-2"
                        variant="ghost"
                      >
                        Edit
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No subcategories available.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
