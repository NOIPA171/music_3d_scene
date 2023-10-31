// without a defined mather, this one line applies next-auth to the entire project
export { default } from "next-auth/middleware";

// If you only want to secure certain pages, export a config object with a matcher:
export const config = { matcher: ["/dashboard"] };
