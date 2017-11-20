import { isNullOrUndefined } from './is-null-or-undefined';

export function isValueValidForView(value: any): boolean {
    if (isNullOrUndefined(value))
        return false;

    let strValue = value.toString().trim();

    return strValue !== '' && strValue !== 'NaN' && strValue !== '[object Object]';
}