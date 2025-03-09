export * from "./store";

export const capitalizeString = (str: string) => {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
