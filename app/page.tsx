"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ResumeDisplay } from "@/components/ResumeDisplay";

export default function Home() {
  const [parsedResume, setParsedResume] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#F2F2F2] p-6">
        <h1 className="text-[#484848] text-3xl font-bold">Resume Parser</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Upload Section */}
        <section className="space-y-4">
          <h2 className="text-2xl text-[#484848] font-semibold">
            Upload Your Resume
          </h2>
          <p className="text-[#767676]">
            Drag and drop your resume PDF or click to browse
          </p>
          <FileUploader onParsedResume={setParsedResume} />
        </section>

        {/* Results Section */}
        {parsedResume && (
          <section className="space-y-4">
            <h2 className="text-2xl text-[#484848] font-semibold">
              Parsed Resume
            </h2>
            <ResumeDisplay resume={parsedResume} />
          </section>
        )}
      </main>
    </div>
  );
}
