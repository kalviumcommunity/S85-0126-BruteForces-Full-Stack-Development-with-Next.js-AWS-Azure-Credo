import { sendSuccess, sendError } from "@/lib/responseHandler";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15, params must be awaited
    const { id } = await params;

    // Simulate DB logic
    if (id === "1") {
      return sendSuccess({ id: 1, name: "Alice" }, "User fetched successfully");
    } else if (id === "2") {
      return sendSuccess({ id: 2, name: "Bob" }, "User fetched successfully");
    }

    // If ID is not 1 or 2, return a Standardized Error
    return sendError("User not found", "NOT_FOUND", 404);
  } catch (err) {
    return sendError("Failed to fetch user", "INTERNAL_ERROR", 500, err);
  }
}
