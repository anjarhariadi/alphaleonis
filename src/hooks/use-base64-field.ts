"use client";

import { useState, useEffect, useCallback } from "react";
import { fileToBase64 } from "@/lib/form-util";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

export function useBase64Field<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>,
) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const base64 = await fileToBase64(file);
      form.setValue(fieldName, base64 as never, { shouldDirty: true });
      const url = URL.createObjectURL(file);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    },
    [form, fieldName],
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return { preview, setPreview, handleChange };
}
