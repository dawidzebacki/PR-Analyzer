import { NextResponse } from "next/server";

import * as cache from "@/lib/cache";
import type { ApiResponse } from "@/types/api";
import type { RepoAnalysis } from "@/types/scoring";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = cache.get(id);

  if (!result) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Result not found or expired", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json<ApiResponse<RepoAnalysis>>({
    success: true,
    data: result,
  });
}
