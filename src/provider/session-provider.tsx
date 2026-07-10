import { useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session";
import GlobalLoader from "@/components/global-loader";
import { useProfileData } from "@/hooks/queries/use-profile-data";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoded = useIsSessionLoaded();

  const { isLoading: isProfileLoading } = useProfileData(session?.user.id);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  if (!isSessionLoded) return <GlobalLoader />;
  if (isProfileLoading) return <GlobalLoader />;
  return children;
}
