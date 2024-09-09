import { createClient } from '@supabase/supabase-js';
import env from '@/lib/env';
import { Database } from './types';

const supabase = createClient<Database>(env.SUPABASE_URL!, env.SUPABASE_KEY!);

export default supabase;
