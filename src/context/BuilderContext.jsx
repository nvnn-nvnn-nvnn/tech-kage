import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const BuilderContext = createContext(undefined);

export function BuilderProvider({ children }) {
  const { user, session } = useAuth();
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
      const API_URL = import.meta.env.VITE_API_URL;

      if (!session?.access_token) {
        throw new Error("No valid session found");
      }

      const response = await fetch(`${API_URL}/api/builds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          build_name: buildName.trim(),
          description: description.trim(),
          parts: selections,
          total_price: total
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save build");
      }

      const savedBuild = await response.json();
      setSavedBuilds(prev => [savedBuild, ...prev]);
      return savedBuild;
    } catch (error) {
      console.error("Error saving build:", error);
      throw error;
    }
  };

  const loadBuild = (build) => {
    setSelections(build.parts || {});
  };

  const fetchSavedBuilds = async () => {
    if (!user) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      if (!session?.access_token) {
        return;
      }

      const response = await fetch(`${API_URL}/api/builds`, {
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const builds = await response.json();
        setSavedBuilds(builds);
      }
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
