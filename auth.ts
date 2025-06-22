import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import GitHub from "next-auth/providers/github" // Example for other providers
// import Google from "next-auth/providers/google" // Example for other providers

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // GitHub, // Example: Add GitHub provider
    // Google, // Example: Add Google provider
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        // This is just a placeholder.
        // In a real application, you'd validate against a database.
        console.log("Credentials received:", credentials);

        // For demonstration, let's assume a user "test@example.com" with password "password"
        if (
          credentials.email === "test@example.com" &&
          credentials.password === "password"
        ) {
          // Any object returned will be saved in `user` property of the JWT
          // and in the `session.user` object of the `useSession` hook.
          return { id: "1", name: "Test User", email: "test@example.com", image: "" };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          console.error("Invalid credentials");
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          // throw new Error("Invalid credentials")
        }
      },
    }),
  ],
  // secret: process.env.AUTH_SECRET, // Strongly recommended to set this in .env.local
  pages: {
    signIn: "/login", // Default is /api/auth/signin
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for email provider)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // callbacks: {
  //   async jwt({ token, user, account, profile, isNewUser }) {
  //     // Add access_token to the token right after signin
  //     if (account && user) {
  //       token.accessToken = account.access_token;
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  //   async session({ session, token, user }) {
  //     // Send properties to the client, like an access_token and user.id from a provider.
  //     if (session.user) {
  //       session.user.id = token.id as string; // Add id to session
  //     }
  //     // session.accessToken = token.accessToken; // Example: expose access token
  //     return session;
  //   },
  // },
  // Events are useful for logging
  // events: {
  //   async signIn(message) { /* on successful sign in */ },
  //   async signOut(message) { /* on signout */ },
  //   async createUser(message) { /* user created */ },
  //   async updateUser(message) { /* user updated - e.g. their email was verified */ },
  //   async linkAccount(message) { /* account linked to a user */ },
  //   async session(message) { /* session is active */ },
  // },

  // Enable debug messages in the console if you are having problems
  // debug: process.env.NODE_ENV === 'development',
});
