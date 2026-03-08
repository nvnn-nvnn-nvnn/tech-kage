import { createContext, useContext, useState, useEffect } from "react";

const BuilderContext = createContext(undefined);

export function BuilderProvider({ children }) {
  const [selections, setSelections] = useState(() => {
    try {
      const saved = localStorage.getItem("tk_builder_selections");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

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

  return (
    <BuilderContext.Provider value={{
      selections,
      selectPart,
      removePart,
      clearBuild,
      total,
      selectedCount,
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
