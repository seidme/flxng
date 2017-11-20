export function objFind(srcObj: any, cb: Function): any {
    if (!srcObj) return undefined;

    let key = Object.keys(srcObj).find(k => cb(srcObj[k]));
    return srcObj[key];
};