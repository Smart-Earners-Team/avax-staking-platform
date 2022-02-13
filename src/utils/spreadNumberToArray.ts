export default function spreadToArray(num: number) {
  return new Array(num).fill(0).map((e, i) => i);
}
