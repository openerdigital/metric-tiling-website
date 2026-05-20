export const scrollTo = (id, behaviour) => {
  document.getElementById(id).scrollIntoView({
    block: "start",
    behavior: behaviour || "smooth",
  });
};
