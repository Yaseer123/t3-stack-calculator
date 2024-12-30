import CategoryForm from "~/components/admin/CategoryForm";

export default function CategoriesPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Manage Categories and Subcategories
      </h1>
      <CategoryForm />
    </main>
  );
}
