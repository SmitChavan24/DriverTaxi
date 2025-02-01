import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto';
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '@env';
console.log(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, "this")
const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Listen for new messages
export const subscribeToMessages = (chat_id, callback) => {
    return supabase
        .from(`Message:chat_id=eq.${chat_id}`)
        .on("INSERT", (payload) => {
            const decryptedMessage = {
                ...payload.new,
                text: decrypt(payload.new.text),
            };
            callback(decryptedMessage);
        })
        .subscribe();
};