export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
