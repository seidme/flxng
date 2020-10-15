import { isNullOrUndefined } from './is-null-or-undefined';


export function resolveDeepValue(src: any, path: string): any {
    if (isNullOrUndefined(src) || typeof path !== 'string')
        return undefined;

    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, '');           // strip a leading dot

    var keys = path.split('.');
    var value = src;

    for (var i = 0, n = keys.length; i < n; ++i) {
        value = value[keys[i]];

        if (isNullOrUndefined(value))
            return i === n - 1
                ? value
                : undefined;
    }

    return value;
}