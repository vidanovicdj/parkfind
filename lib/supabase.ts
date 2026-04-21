import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gshspliuggmjuaaunnmf.supabase.co/rest/v1/"; //Project Settings -> Data API -> API URL
const supabaseAnonKey = "sb_publishable_18hTAbWRiudH0y9vulIN2g_EYLNOmsu"; //Project Settings -> API keys ->Publishable key

export const supabase = createClient(supabaseUrl,supabaseAnonKey);