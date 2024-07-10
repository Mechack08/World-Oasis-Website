// Just demonstrate how middleware works

/* import { NextResponse } from "next/server";

export function middleware(request: Request) {
    console.log(request);
    
    return NextResponse.redirect(new URL("/about", request.url));
    }
    
    export const config = {
        matcher: ["/account"],
        }; */

import { auth } from "./app/_lib/auth";
export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
