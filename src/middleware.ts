import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cleanPathname = pathname.replace(/^\/(?:ar|en)(?=\/|$)/, "");

  const response = intlMiddleware(request);
  response.headers.set("x-pathname", cleanPathname);

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
