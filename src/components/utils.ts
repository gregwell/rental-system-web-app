export const getHundredRandomSkiNames = (): String[] => {
  let arr: String[] = [];

  for (let i = 0; i < 100; i++) {
    arr[i] = `Atomic Redster S${i + 8}`;
  }

  return arr;
};
