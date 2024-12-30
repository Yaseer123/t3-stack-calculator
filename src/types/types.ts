// Ensure the keywords property is properly typed in your types definition
export type Calculator = {
  seoTitle: string;
  seoDescription: string;
  keywords: string[]; // Ensure this is a string array
  content: {
    html: string;
    text: string;
  };
  id: number;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  subcategoryId: number | null;
};
