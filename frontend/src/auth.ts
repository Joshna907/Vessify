import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: "IevNdn3tDVFkrEGbzLhgHhWbVJeQqY/H9f4dC4QOQJs=",
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    // Call backend login
                    // Call backend login
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                    const res = await fetch(`${apiUrl}/api/auth/sign-in/email`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Origin": "http://localhost:3000" // Required by Better Auth for CSRF checks
                        },
                        body: JSON.stringify(credentials),
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error("[Auth] Login request failed:", res.status, errorText);
                        return null;
                    }

                    const data = await res.json();
                    console.log("[Auth] Login response data:", JSON.stringify(data, null, 2));

                    if (!data.user || (!data.session && !data.token)) {
                        console.error("[Auth] Missing user or session/token in response:", data);
                        return null;
                    }

                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        image: data.user.image,
                        sessionToken: data.session?.token || data.token
                    };
                } catch (e) {
                    console.error("[Auth] Authorize error:", e);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.sessionToken = user.sessionToken;
            }
            return token;
        },
        async session({ session, token }) {
            // @ts-ignore
            session.user.id = token.id;
            // @ts-ignore
            session.accessToken = token.sessionToken;
            return session;
        }
    },
    pages: {
        signIn: "/login",
    }
})
