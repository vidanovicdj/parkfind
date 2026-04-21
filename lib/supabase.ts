import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cvsyjnrsgktuhazljkec.supabase.co";
const supabaseAnonKey = "sb_publishable_ZKzNwOqFBEmvQxp3xjSz8w_MuTJ1MZ9";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);