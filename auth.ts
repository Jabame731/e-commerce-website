import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //check if user exist and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          console.log("ismatch", isMatch);

          //if password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        //if user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      //set the user id from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      //if there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },

    async jwt({ token, user, trigger, session }: any) {
      //assign user fields to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        //if the user has no name then use email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          //update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        // @ to be fixed
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObj = await cookies();

          const sessionCartId = cookiesObj.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              //delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              //assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }
      }

      //handle session updates
      if (session?.user?.name && trigger === "update") {
        token.name = session?.user?.name;
      }

      return token;
    },
    authorized({ request, auth }: any) {
      //array of regular expression of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      //get pathname from the request url object
      const { pathname } = request.nextUrl;

      //check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // check session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        //clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        //create the new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //set newly generated sessonCardId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
