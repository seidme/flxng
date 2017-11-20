import { isValueValidForView } from './is-value-valid-for-view';

export function compareValues(valA: any, valB: any, collator: Intl.Collator): number {

    let isValidA = isValueValidForView(valA);
    let isValidB = isValueValidForView(valB)

    if (!isValidA && isValidB)
        return -1;

    else if (!isValidA && !isValidB)
        return 0;

    else if (isValidA && !isValidB)
        return 1;

    else if (typeof valA === 'string' || typeof valB === 'string') {
        if (typeof valA !== 'string') valA = valA.toString();
        if (typeof valB !== 'string') valB = valB.toString();

        return collator.compare(valA, valB);
    }
    else {
        return ((valA > valB ? 1 : 0) - (valB > valA ? 1 : 0));
    }
}