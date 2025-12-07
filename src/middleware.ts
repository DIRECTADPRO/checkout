/* FILE: src/middleware.ts */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/audit(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 1. Await the auth() promise to get the session object
    const authObj = await auth();
    
    // 2. Check if user is logged in
    if (!authObj.userId) {
       // 3. Redirect if not authenticated
       return authObj.redirectToSignIn(); 
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};