export function findAncestor(elem: HTMLElement, className: string): HTMLElement {
    while ((elem = elem.parentElement) && !elem.classList.contains(className));
    return elem;
}