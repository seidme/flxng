export function mapToIterable(o: {[key: string]: any}): Array<any> {
    return Object.keys(o).map(key => o[key]);
}
