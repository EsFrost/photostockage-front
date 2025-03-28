import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(req: Request) {
  try {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const fileIdentifier = data.get("identifier") as string;
  
  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file uploaded" },
      { status: 400 }
    );
  }
  
  if (!fileIdentifier) {
    return NextResponse.json(
      { success: false, error: "No file identifier provided" },
      { status: 400 }
    );
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileName = `${fileIdentifier}${file.name.substring(
    file.name.lastIndexOf(".")
  )}`;
  
  const uploadDir = join(process.cwd(), "public/images/users");
  
  // Create directory if it doesn't exist
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Error creating directory:", err);
  }
  
  const path = join(uploadDir, fileName);
  
  // Add debugging
  console.log("Attempting to write file to:", path);
  
  try {
    await writeFile(path, new Uint8Array(buffer));
    console.log("File written successfully");
  } catch (writeErr) {
    console.error("Error writing file:", writeErr);
    throw writeErr;
  }
  
  return NextResponse.json({
    success: true,
    fileUrl: `/images/users/${fileName}`,
  });
} catch (error) {
  console.error("Error uploading file:", error);
  // Include more details in error response
  return NextResponse.json(
    { 
      success: false, 
      error: "Failed to upload file", 
      details: error instanceof Error ? error.message : String(error) 
    },
    { status: 500 }
  );
}
