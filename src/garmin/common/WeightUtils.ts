export function gramsToPounds(weightInGrams: number): number {
    const gramsPerPound = 453.592;
    return weightInGrams / gramsPerPound;
}
