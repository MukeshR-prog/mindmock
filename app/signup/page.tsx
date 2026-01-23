"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // ✅ Create user in MongoDB (important)
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
        }),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
        }),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[380px]">
        <CardHeader className="justify-center text-xl font-semibold">
          Create an Account
        </CardHeader>

        <CardBody className="space-y-4">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Input
            label="Email"
            type="email"
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            onChange={(e: any) => setPassword(e.target.value)}
          />

          <Button
            color="primary"
            onPress={handleSignup}
            isLoading={loading}
          >
            Sign Up
          </Button>

          <Button variant="bordered" onPress={handleGoogleSignup}>
            Continue with Google
          </Button>

          <Divider />

          <Button
            size="sm"
            variant="light"
            onPress={() => router.push("/login")}
          >
            Already have an account? Login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
