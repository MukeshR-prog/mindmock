"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[380px]">
        <CardHeader className="justify-center text-xl font-semibold">
          Login to TheMindMock
        </CardHeader>

        <CardBody className="space-y-4">
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

          <Button color="primary" onPress={handleEmailLogin}>
            Login
          </Button>

          <Button variant="bordered" onPress={handleGoogleLogin}>
            Continue with Google
          </Button>

          <Divider />

          <Button
            size="sm"
            variant="light"
            onPress={() => router.push("/forgot-password")}
          >
            Forgot Password?
          </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => router.push("/signup")}
          >
            New user? Create an account
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
