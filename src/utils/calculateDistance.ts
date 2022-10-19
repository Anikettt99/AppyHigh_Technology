const getDistance = (x1: string, y1: string, x2: string, y2: string) => {
  const x = parseFloat(x2) - parseFloat(x1);
  const y = parseFloat(y2) - parseFloat(y1);
  return Math.sqrt(x * x + y * y);
};

export { getDistance };
