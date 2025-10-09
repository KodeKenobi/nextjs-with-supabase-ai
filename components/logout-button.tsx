"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log("👋 User logging out:", {
      email: user?.email,
      userId: user?.id,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionDuration: user?.last_sign_in_at ? 
        Math.round((Date.now() - new Date(user.last_sign_in_at).getTime()) / 1000 / 60) + ' minutes' : 'unknown'
    });
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
