export default (dividend: number, divisor: number): number => {
    const result = dividend % divisor;
    return result >= 0 ? result : result + divisor;
}
