import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      throw new Error("No file uploaded");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParser = new PDFParser();

    const text = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = decodeURIComponent(
          pdfData.Pages.map((page) =>
            page.Texts.map((text) => text.R.map((r) => r.T).join(" ")).join(" ")
          ).join("\n")
        );
        resolve(text);
      });

      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.parseBuffer(buffer);
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error extracting text:", error);
    return NextResponse.json(
      { error: "Failed to extract text" },
      { status: 500 }
    );
  }
}
