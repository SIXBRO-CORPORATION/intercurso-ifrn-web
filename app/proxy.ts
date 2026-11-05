import { NextResponse, type NextRequest } from "next/server"
import { findRoute } from "@/core/routes/match-route"

const UNREGISTERED_PATH = "/_unregistered"

export function proxy(request: NextRequest) {
  if (findRoute(request.nextUrl.pathname)) return NextResponse.next()
  return NextResponse.rewrite(new URL(UNREGISTERED_PATH, request.url))
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
