import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

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
    const path = join(uploadDir, fileName);

    // await writeFile(path, buffer); // Throws type error, it should work with node js normally though as it was tested
    await writeFile(path, new Uint8Array(buffer));

    return NextResponse.json({
      success: true,
      fileUrl: `/images/users/${fileName}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
