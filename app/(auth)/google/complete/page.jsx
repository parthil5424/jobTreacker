"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/Store/useAuthStore";

export default function GoogleComplete() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, [session, router, status]);

  const fetchData = async () => {
    try {
      if (session?.user?.email) {
        const resLogin = await fetch("/api/Login", {
          method: "POST",
          body: JSON.stringify({
            email: session?.user?.email,
            provider: "google",
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (resLogin.status === 200) {
          const loginData = await resLogin.json();
          login(loginData.data, loginData.token);
          if (loginData.data.role.name == "Admin") {
            router.push("/Admin/DashBoard");
          } else {
            router.push("/Merchant/DashBoard");
          }
        } else {
          if (resLogin.status === 400) {
            console.error("No User Found");
          }
        }
      }
    } catch (err) {
      console.error("Error", err);
      router.push("/Login");
    }
  };

  return <p>Finalizing your login...</p>;
}
