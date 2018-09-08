export default (array, item) => {
  const len = array.length;
  if (len < 1) return null;
  const interspersed = [array[0]];
  for (let i = 0; i < len - 1; i += 1) {
    interspersed.push(item);
    interspersed.push(array[i + 1]);
  }
  return interspersed;
};
