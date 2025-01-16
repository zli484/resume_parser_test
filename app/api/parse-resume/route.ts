import { NextResponse } from "next/server";
import OpenAI from "openai";
import { DEFAULT_MODEL } from "@/constants";

export const maxDuration = 60;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESUME_SCHEMA = {
  personalInfo: {
    name: "string",
    email: "string",
    phone: "string",
    location: "string",
    linkedIn: "string?",
    portfolio: "string?",
  },
  summary: "string",
  education: [
    {
      degree: "string",
      institution: "string",
      location: "string",
      graduationDate: "string",
      gpa: "number?",
    },
  ],
  experience: [
    {
      title: "string",
      company: "string",
      location: "string",
      startDate: "string",
      endDate: "string",
      highlights: "string[]",
    },
  ],
  skills: {
    technical: "string[]",
    soft: "string[]",
  },
  certifications: [
    {
      name: "string",
      issuer: "string",
      date: "string",
    },
  ],
  languages: [
    {
      language: "string",
      proficiency: "string",
    },
  ],
};

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a resume parser. Parse the given resume text into a JSON object following this schema: ${JSON.stringify(
            RESUME_SCHEMA,
            null,
            2
          )}. Ensure all dates are in YYYY-MM format and all strings are properly formatted.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No content in the response");
    }

    const parsedResume = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(parsedResume);
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
