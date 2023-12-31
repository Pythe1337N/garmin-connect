export function convertMLToOunces(valueInML: number): number {
    const conversionFactor = 0.033814;
    const valueInOunces = valueInML * conversionFactor;
    return valueInOunces;
}
