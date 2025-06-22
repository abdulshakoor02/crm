"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false, // We'll handle redirection manually
        email,
        password,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error);
        console.error("Sign-in error:", result.error);
      } else if (result?.ok) {
        // Sign-in was successful
        router.push("/"); // Redirect to home page or dashboard
      } else {
        setError("An unknown error occurred during sign-in.");
        console.error("Unknown sign-in response:", result);
      }
    } catch (err) {
      console.error("Sign-in exception:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Test credentials: <br />
        Email: <code>test@example.com</code> <br />
        Password: <code>password</code>
      </p>
    </div>
  );
}
