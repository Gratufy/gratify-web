import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // это можно использовать
  process.env.SUPABASE_SERVICE_ROLE_KEY! // НИКОГДА не публиковать на клиент
);

export { supabaseAdmin };
