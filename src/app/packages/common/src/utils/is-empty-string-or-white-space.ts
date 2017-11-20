export function isEmptyStringOrWhiteSpace(value: any): boolean {
    return typeof value === 'string' && value.trim() === '';
}