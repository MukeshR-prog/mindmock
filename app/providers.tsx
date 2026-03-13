"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

import { auth } from "@/config/firebase";
import { useAuthStore } from "@/store/authStore";

import type { ThemeProviderProps } from "next-themes";

/* ---------- Types ---------- */
interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

/* ---------- Module augmentation (Hero UI + Next Router) ---------- */
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

/* ---------- Provider ---------- */
export default function Providers({
  children,
  themeProps,
}: ProvidersProps) {
  const router = useRouter();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        (async () => {
          try {
            // Get Firebase ID token once — used for both calls below
            const idToken = await user.getIdToken();

            // 1. Sync user record in MongoDB (send Firebase token so the
            //    server can verify the caller before upserting)
            await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                firebaseUid: user.uid,
                email: user.email,
                name: user.displayName,
                provider: user.providerData[0]?.providerId,
              }),
            });

            // 2. Exchange Firebase ID token for our signed JWT (stored as httpOnly cookie)
            await fetch("/api/auth/token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            });
          } catch (error) {
            console.error("Failed to sync user:", error);
          }
        })();
      } else {
        // Clear the JWT cookie on sign-out
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...themeProps}
      >
        <ToastProvider placement="top-right" />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
