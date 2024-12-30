"use client";

import { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function RichTextEditor({
  content,
  onContentChange,
}: {
  content: { html: string; text: string };
  onContentChange: (value: { html: string; text: string }) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quill) {
      const quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });

      setQuill(quillInstance);

      quillInstance.on("text-change", () => {
        const html = quillInstance.root.innerHTML;
        const text = quillInstance.getText();
        onContentChange({ html, text });
      });
    }
  }, [editorRef, quill, onContentChange]);

  useEffect(() => {
    if (quill) {
      const editorHtml = quill.root.innerHTML;
      if (content.html !== editorHtml) {
        quill.clipboard.dangerouslyPasteHTML(content.html); // Use Quill's API to update content
      }
    }
  }, [content, quill]);

  return (
    <div ref={editorRef} className="min-h-[200px] rounded-md border"></div>
  );
}
