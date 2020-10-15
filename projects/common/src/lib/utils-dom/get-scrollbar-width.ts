export function getScrollbarWidth(): number {
    let scrollbarWidth: number = 0;
    let docBodyElem = document.body;

    let elem = document.createElement('div');
    elem.style['overflow'] = 'scroll';
    elem.style['width'] = '100px';
    elem.style['height'] = '100px';

    docBodyElem.appendChild(elem);
    scrollbarWidth = elem.offsetWidth - elem.clientWidth;
    docBodyElem.removeChild(elem);

    return scrollbarWidth;
}