import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Utility to store the token in AsyncStorage and cookies
    const storeToken = (token) => {
        if (token) {
            AsyncStorage.setItem("auth-token", token);
            // document.cookie = `auth-token=${token}; path=/; Secure; SameSite=Strict`;
        }
    };

    // Utility to clear the token from AsyncStorage and cookies
    const clearToken = () => {
        AsyncStorage.removeItem("auth-token");
        // document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    };

    // Fetch the current user session and set the user
    const fetchSession = async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (data.session) {
                storeToken(data.session.access_token);
                setUser(data.session.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error fetching session:", err);
        } finally {
            setLoading(false);
        }
    };

    // Effect to handle auth state changes and initialize user session
    useEffect(() => {
        const { data: authListener } = supabase?.auth?.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (session?.access_token) storeToken(session.access_token);
        });

        fetchSession();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Sign-up method
    const signUp = async (email, password) => {
        setLoading(true);
        setError("");
        try {
            const { response, error } = await supabase.auth.signUp({ email, password });
            console.log(response, response?.session, "Error")
            if (error) throw error;

            if (response?.session?.access_token) {

                AsyncStorage.setItem("auth-token", response.session.access_token);
                // document.cookie = `auth-token=${response.session.access_token}; path=/;`;
            }
            return { response };
        }
        catch (err) {
            console.error("Sign-up error:", err);
            setError(err.message);
            return { error: err };
        }
        finally {
            setLoading(false);
        }
    };

    // Log-in method
    const logIn = async (email, password) => {
        setLoading(true);
        setError("");
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.session?.access_token) {
                storeToken(data.session.access_token);
            }

            return { data };
        } catch (err) {
            console.error("Log-in error:", err);
            setError(err.message);
            return { error: err };
        } finally {
            setLoading(false);
        }
    };

    // Log-out method
    const logOut = async () => {
        setLoading(true);
        setError("");
        try {
            const { error } = await supabase?.auth?.signOut();
            if (error) throw error;

            clearToken();
            setUser(null);
        } catch (err) {
            console.error("Log-out error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // OAuth sign-in method
    const signInWithOAuth = async (provider) => {
        setLoading(true);
        setError("");
        try {
            const { data, error } = await supabase?.auth?.signInWithOAuth({ provider });
            if (error) throw error;

            if (data.session?.access_token) {
                storeToken(data.session.access_token);
            }

            return { data };
        } catch (err) {
            console.error("OAuth sign-in error:", err);
            setError(err.message);
            return { error: err };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        signUp,
        logIn,
        logOut,
        signInWithOAuth,
    };
};

export default useAuth;
