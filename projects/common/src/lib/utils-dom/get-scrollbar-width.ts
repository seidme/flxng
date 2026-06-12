export function getScrollbarWidth(): number {
  const elem = document.createElement('div');
  elem.style['overflow'] = 'scroll';
  elem.style['width'] = '100px';
  elem.style['height'] = '100px';

  document.body.appendChild(elem);
  const scrollbarWidth = elem.offsetWidth - elem.clientWidth;
  document.body.removeChild(elem);

  return scrollbarWidth;
}
