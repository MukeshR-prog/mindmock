"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[360px]">
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold text-center">
            Reset Password
          </h2>

          <Input
            label="Email"
            type="email"
            onChange={(e:any) => setEmail(e.target.value)}
          />

          <Button color="primary" onPress={handleReset}>
            Send Reset Link
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
