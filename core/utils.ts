export const normalize = (a: number[]) => {
  const norm = Math.hypot(...a); // Euclidean norm
  return a.map((v) => v / norm);
};
