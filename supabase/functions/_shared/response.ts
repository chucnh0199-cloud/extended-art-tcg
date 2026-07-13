import { corsHeaders } from "./cors.ts";

export function success(data: Record<string, unknown> = {}) {

  return Response.json(
    {
      success: true,
      ...data,
    },
    {
      headers: corsHeaders,
    }
  );

}

export function failure(error: unknown, status = 500) {

  return Response.json(
    {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : String(error),
    },
    {
      status,
      headers: corsHeaders,
    }
  );

}