import { createClient } from "@supabase/supabase-js";
import { type Database } from "./database.types";

const supabaseUrl = process.env.SERVER_SUPABASE_PROJECT_URL as string;
const supabaseKey = process.env.SERVER_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
  },
});

// start auto refresh session
supabase.auth.onAuthStateChange((_event, session) => {
  console.log("onAuthStateChange is running");
  console.log("session", session);
  if (session) {
    console.log("session", session);
  }
});
