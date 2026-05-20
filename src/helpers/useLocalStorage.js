import { useEffect, useState } from "react";

const getSavedValue = (key, initialValue) => {
  const savedValue =
    typeof window !== "undefined" &&
    JSON.parse(window.localStorage.getItem(key));
  if (savedValue) return savedValue;
  if (initialValue instanceof Function) return initialValue();
  return initialValue;
};

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => getSavedValue(key, initialValue));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
