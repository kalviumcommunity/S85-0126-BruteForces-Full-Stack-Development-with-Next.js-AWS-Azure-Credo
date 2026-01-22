import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib-1/s3";

export async function POST(req: Request) {
  try {
    const { filename, fileType, fileSize } = await req.json();

    // ✅ Validation
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ success: false, message: "Invalid file type" }, { status: 400 });
    }

    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File too large (max 5MB)" }, { status: 400 });
    }

    const key = `uploads/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({
      success: true,
      uploadURL,
      fileKey: key,
      fileURL: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to generate URL" }, { status: 500 });
  }
}
