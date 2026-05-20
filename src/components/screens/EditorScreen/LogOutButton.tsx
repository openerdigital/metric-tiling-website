import { supabaseBrowser } from "src/lib/supabase/supabaseBrowser";

import { ContentButton } from "./ContentButton";

export function LogoutButton() {
  const logout = async () => {
    const supabase = supabaseBrowser();

    await supabase.auth.signOut();

    // Hard redirect to clear all state
    window.location.href = "/login";
  };

  return (
    <ContentButton
      type="button"
      onClick={logout}
      variant="delete"
      className="mb-1 h-40 w-full"
    >
      Log out
    </ContentButton>
  );
}
