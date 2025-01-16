"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DEFAULT_MODEL } from "@/constants";

interface FileUploaderProps {
  onParsedResume: (resume: any) => void;
}

export function FileUploader({ onParsedResume }: FileUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsLoading(true);
      try {
        // First, extract text from PDF
        const formData = new FormData();
        formData.append("file", file);

        const textResponse = await fetch("/api/extract-text", {
          method: "POST",
          body: formData,
        });

        const { text } = await textResponse.json();

        // Then, parse the text with OpenAI
        const parseResponse = await fetch("/api/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        const parsedResume = await parseResponse.json();
        onParsedResume(parsedResume);
      } catch (error) {
        console.error("Error processing resume:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onParsedResume]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        ${isDragActive ? "border-[#FF5A5F] bg-[#FF5A5F]/5" : "border-[#F2F2F2]"}
        transition-colors duration-200 cursor-pointer
        flex flex-col items-center justify-center
        min-h-[200px]
      `}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-[#FF5A5F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#484848]">Processing your resume...</p>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <p className="text-[#484848]">
            {isDragActive
              ? "Drop your resume here"
              : "Drag & drop your resume PDF here"}
          </p>
          <p className="text-[#767676] text-sm">or click to browse</p>
        </div>
      )}
    </div>
  );
}
