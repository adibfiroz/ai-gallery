export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profile/:path*",
    "/profile/:path*/settings",
    "/profile/:path*/collections",
    "/profile/:path*/:path*",
  ],
};
