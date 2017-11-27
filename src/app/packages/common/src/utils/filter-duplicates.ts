export function filterDuplicates(arr: any[]): any[] {
    var arrLength = arr.length;
    var dups = [];

    for(let i = 0; i < arrLength; ++i) {
        if(dups.indexOf(arr[i]) > -1) {
            // already added
            continue;
        }

        for(let j = i + 1; j < arrLength; ++j) {
            if(arr[i] === arr[j]) {
                dups.push(arr[i]);
                j = arrLength; // break
            }
        }
    }

    return dups;
}