import { sendSuccess, sendError } from "@/lib-1/responseHandler";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validation Check
    if (!data.title) {
      return sendError(
        "Missing required field: title",
        "VALIDATION_ERROR",
        400
      );
    }

    const newTask = { id: Date.now(), title: data.title, completed: false };
    return sendSuccess(newTask, "Task created successfully", 201);
  } catch (err) {
    return sendError("Invalid JSON input", "TASK_CREATION_FAILED", 500, err);
  }
}
