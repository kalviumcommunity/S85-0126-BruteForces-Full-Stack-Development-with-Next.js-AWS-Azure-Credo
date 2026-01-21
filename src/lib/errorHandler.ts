import { NextResponse } from "next/server";
import { logger } from "./logger";

export function handleError(error: unknown, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  const message =
    error instanceof Error ? error.message : "Unknown error";
  const stack =
    error instanceof Error ? error.stack : undefined;

  const errorResponse = {
    success: false,
    message: isProd
      ? "Something went wrong. Please try again later."
      : message,
    ...(isProd ? {} : { stack }),
  };

  logger.error(`Error in ${context}`, {
    message,
    stack: isProd ? "REDACTED" : stack,
  });

  return NextResponse.json(errorResponse, { status: 500 });
}
