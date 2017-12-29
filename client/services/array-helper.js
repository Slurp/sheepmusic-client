const arrayFunctions = {
  initializeArrayWithRange : (end, start = 0) =>
    Array.from({ length: (end + 1) - start }).map((v, i) => i + start),
  initializeArrayWithValues:(n, value = 0) => Array(n).fill(value)
}
export default arrayFunctions

