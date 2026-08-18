import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

type HealthContextType = {
  isChecking: boolean;
};

const HealthContext = createContext<HealthContextType>({ isChecking: false });

export const useHealth = () => useContext(HealthContext);

export const HealthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("healthChecked") === "true") return;

    let mounted = true;
    setIsChecking(true);

    const poll = setInterval(() => {
      api
        .get("/health")
        .then(() => {
          if (!mounted) return;
          clearInterval(poll);
          localStorage.setItem("healthChecked", "true");
          setIsChecking(false);
          // refresh the page so frontend can assume backend is up
          window.location.reload();
        })
        .catch(() => {
          // still not up, will try again
        });
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, []);

  return (
    <HealthContext.Provider value={{ isChecking }}>
      {children}
    </HealthContext.Provider>
  );
};

export default HealthContext;
