export function getRandomElem(array) {
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}
