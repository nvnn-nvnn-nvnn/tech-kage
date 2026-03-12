import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

const BuilderContext = createContext(undefined);

export function BuilderProvider({ children }) {
  const { user } = useAuth();
  const [selections, setSelections] = useState(() => {
    try {
      const saved = localStorage.getItem("tk_builder_selections");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [savedBuilds, setSavedBuilds] = useState([]);

  useEffect(() => {
    localStorage.setItem("tk_builder_selections", JSON.stringify(selections));
  }, [selections]);

  const selectPart = (category, part) => {
    setSelections(prev => ({ ...prev, [category]: part }));
  };

  const removePart = (category) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[category];
      return newSelections;
    });
  };

  const clearBuild = () => {
    setSelections({});
    localStorage.removeItem("tk_builder_selections");
  };

  const total = Object.values(selections).reduce((sum, part) => {
    const price = part.base - part.promo + part.shipping + part.tax;
    return sum + price;
  }, 0);

  const selectedCount = Object.keys(selections).length;

  const saveBuild = async (buildName, description = "") => {
    if (!user) {
      throw new Error("You must be logged in to save builds");
    }

    if (!buildName || !buildName.trim()) {
      throw new Error("Build name is required");
    }

    if (selectedCount === 0) {
      throw new Error("Cannot save an empty build");
    }

    try {
      // Check for duplicate build name
      const { data: existing, error: existingError } = await supabase
        .from("saved_builds")
        .select("id")
        .eq("user_id", user.id)
        .eq("build_name", buildName.trim())
        .maybeSingle();

      if (existingError) {
        throw new Error("Error checking for existing build");
      }

      if (existing) {
        throw new Error("A build with this name already exists");
      }

      // Save to Supabase (matching PCbuilder.jsx schema)
      const { data, error } = await supabase
        .from("saved_builds")
        .insert({
          user_id: user.id,
          build_name: buildName.trim(),
          build_data: selections,
          total_price: total,
          config: { type: "manual", description: description.trim() }
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Failed to save build");
      }

      setSavedBuilds(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error saving build:", error);
      throw error;
    }
  };

  const loadBuild = (build) => {
    setSelections(build.build_data || build.parts || {});
  };

  const fetchSavedBuilds = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("saved_builds")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching builds:", error);
        return;
      }

      setSavedBuilds(data || []);
    } catch (error) {
      console.error("Error fetching builds:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedBuilds();
    }
  }, [user]);

  return (
    <BuilderContext.Provider value={{
      selections,
      selectPart,
      removePart,
      clearBuild,
      total,
      selectedCount,
      saveBuild,
      loadBuild,
      savedBuilds,
      fetchSavedBuilds,
    }}>
      {children}
    </BuilderContext.Provider>
  );
}

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within BuilderProvider");
  }
  return context;
};
