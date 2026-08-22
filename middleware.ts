import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  /*
   * =========================
   * ALLOW LOGIN PAGE
   * =========================
   */

  if (request.nextUrl.pathname === "/admin/login") {
    return response;
  }

  /*
   * =========================
   * SUPABASE SERVER CLIENT
   * =========================
   */

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /*
   * =========================
   * CHECK AUTHENTICATION
   * =========================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * =========================
   * REQUIRE LOGIN
   * =========================
   */

  if (!user) {
    const loginUrl = new URL(
      "/admin/login",
      request.url
    );

    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  /*
   * =========================
   * ADMIN USER ONLY
   * =========================
   */

  const ADMIN_USER_ID =
    "26c2e53b-2ad7-4829-8835-72486fe7e1de";

  if (user.id !== ADMIN_USER_ID) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};