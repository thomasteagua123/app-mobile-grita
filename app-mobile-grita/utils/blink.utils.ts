export const isEyesClosed = (left?: number, right?: number) => {
  return (left ?? 1) < 0.3 && (right ?? 1) < 0.3;
};
