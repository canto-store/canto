import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 4MB limit" },
        { status: 400 },
      );
    }

    const fileName = `product-images/${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();
    const body = new Uint8Array(buffer);

    const bucketName = process.env.SPACES_BUCKET || "canto-storage";
    const region = process.env.SPACES_REGION || "fra1";

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: body,
        ContentType: file.type,
        ACL: "public-read",
      });

      await s3Client.send(command);

      const fileUrl = `https://${bucketName}.${region}.digitaloceanspaces.com/${fileName}`;
      return NextResponse.json({ success: true, fileUrl });
    } catch (e: unknown) {
      console.error("S3 specific error:", (e as Error).message);
      return NextResponse.json(
        {
          error: `S3 upload failed: ${(e as Error).message || "Unknown S3 error"}`,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
