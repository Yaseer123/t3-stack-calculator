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
import RichTextEditor from "./RichTextEditor";
import { Calculator } from "~/types/types";

export default function CalculatorForm() {
  const [calculatorName, setCalculatorName] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [content, setContent] = useState<Calculator["content"]>({
    html: "",
    text: "",
  });
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number>(0);
  const [editingCalculator, setEditingCalculator] = useState<Calculator | null>(
    null,
  );

  const { data: subcategories = [] } = api.subcategory.getAll.useQuery();
  const { data: calculators = [], refetch: refetchCalculators } =
    api.calculator.getAll.useQuery();

  const addCalculator = api.calculator.create.useMutation({
    onSuccess: () => {
      resetForm();
      refetchCalculators();
    },
  });

  const updateCalculator = api.calculator.update.useMutation({
    onSuccess: () => {
      resetForm();
      refetchCalculators();
    },
  });

  const resetForm = () => {
    setCalculatorName("");
    setSeoTitle("");
    setSeoDescription("");
    setKeywords([]);
    setContent({ html: "", text: "" });
    setSelectedSubcategoryId(0);
    setEditingCalculator(null);
  };

  const handleAddOrUpdateCalculator = () => {
    if (!selectedSubcategoryId) {
      alert("Please select a subcategory.");
      return;
    }

    const payload: Omit<Calculator, "id" | "createdAt" | "updatedAt"> = {
      name: calculatorName,
      seoTitle,
      seoDescription,
      keywords,
      content,
      subcategoryId: selectedSubcategoryId, // Ensure subcategoryId is a number
    };

    if (editingCalculator) {
      updateCalculator.mutate({
        id: editingCalculator.id,
        ...payload,
      });
    } else {
      addCalculator.mutate(payload);
    }
  };

  const handleEdit = (calc: Calculator) => {
    setEditingCalculator(calc);
    setCalculatorName(calc.name);
    setSeoTitle(calc.seoTitle);
    setSeoDescription(calc.seoDescription);
    setKeywords(Array.isArray(calc.keywords) ? calc.keywords : []);
    setContent(
      typeof calc.content === "object" && calc.content !== null
        ? (calc.content as Calculator["content"])
        : { html: "", text: "" },
    );
    setSelectedSubcategoryId(calc.subcategoryId || 0);
  };

  return (
    <div className="grid gap-6 p-4 md:p-8">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {editingCalculator ? "Edit Calculator" : "Add a New Calculator"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={calculatorName}
            onChange={(e) => setCalculatorName(e.target.value)}
            placeholder="Enter calculator name"
            className="mb-4"
          />
          <Input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Enter SEO title"
            className="mb-4"
          />
          <Input
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Enter SEO description"
            className="mb-4"
          />
          <Input
            value={keywords.join(", ")}
            onChange={(e) =>
              setKeywords(
                e.target.value.split(",").map((keyword) => keyword.trim()),
              )
            }
            placeholder="Enter keywords separated by commas"
            className="mb-4"
          />
          <RichTextEditor
            content={content}
            onContentChange={(value) => setContent(value)}
          />
          <Select
            value={String(selectedSubcategoryId)}
            onValueChange={(value) => setSelectedSubcategoryId(Number(value))}
          >
            <SelectTrigger className="mt-4 w-full">
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((sub) => (
                <SelectItem key={sub.id} value={String(sub.id)}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddOrUpdateCalculator}>
            {editingCalculator ? "Update Calculator" : "Add Calculator"}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Existing Calculators</h2>
        {calculators.map((calc) => (
          <Card key={calc.id}>
            <CardHeader>
              <CardTitle>
                {calc.name}
                <Button
                  variant="ghost"
                  className="ml-4"
                  onClick={() => handleEdit(calc)}
                >
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                SEO Title: {calc.seoTitle}
              </p>
              <p className="text-sm text-gray-500">
                SEO Description: {calc.seoDescription}
              </p>
              <p className="text-sm text-gray-500">
                Keywords:{" "}
                {Array.isArray(calc.keywords) ? calc.keywords.join(", ") : ""}
              </p>
              <p className="text-sm text-gray-500">
                Content Preview:{" "}
                {typeof calc.content === "object" && calc.content !== null
                  ? (calc.content as { html: string }).html.slice(0, 50)
                  : ""}
                ...
              </p>
              <p className="text-sm text-gray-500">
                Subcategory ID: {calc.subcategoryId || "None"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
