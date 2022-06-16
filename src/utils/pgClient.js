import { createClient } from "@supabase/supabase-js";

const pgClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default pgClient;
