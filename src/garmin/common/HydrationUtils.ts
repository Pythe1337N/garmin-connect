export function convertMLToOunces(valueInML: number): number {
    const conversionFactor = 0.033814;
    const valueInOunces = valueInML * conversionFactor;
    return valueInOunces;
}

export function convertOuncesToML(ounces: number): number {
    const ouncesToMillilitersConversionFactor = 29.5735;
    const milliliters = ounces * ouncesToMillilitersConversionFactor;
    return milliliters;
}
