"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      console.log("Attempting Firebase signIn for:", email);
      let userCred;
      try {
        userCred = await signInWithEmailAndPassword(auth, email, password);
        console.log("Firebase signIn success:", userCred.user?.email);
      } catch (err: any) {
        console.error("Firebase signIn error:", err);
        setError(err?.message || "Firebase sign-in failed.");
        return;
      }

      const idToken = await userCred.user.getIdToken();
      console.log("Obtained idToken (truncated):", idToken?.slice?.(0, 20));

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        // ensure browser stores HttpOnly cookie from server
        credentials: "include",
      });

      const text = await res.text();
      console.log("/api/auth/login response:", res.status, text);

      if (res.ok) {
        // cookie is set by server (httpOnly). Redirect to dashboard.
        console.log("Login successful, redirecting to /dashboard");
        router.push("/dashboard");
      } else {
        let payload: any = {};
        try {
          payload = JSON.parse(text || "{}");
        } catch (_) {
          payload = { message: text };
        }
        setError(`Server: ${res.status} — ${payload?.message || text || "Login failed."}`);
      }
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ width: 420, p: 4 }}>
        <Typography variant="h5" mb={2}>Sign in</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ autoComplete: "email" }}
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            fullWidth
            margin="normal"
            inputProps={{ autoComplete: "current-password" }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
