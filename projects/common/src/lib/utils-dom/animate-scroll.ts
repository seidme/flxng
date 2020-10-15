export interface IScrollOptions {
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Smoothness of the animation (lower number -> more frames) */
  smoothness?: number;
  /** Callback to be executed once the animation is done */
  onCompleted?: Function;
}

export function scrollIntoView(
  element: HTMLElement | Element,
  offset: number = 0,
  opts: IScrollOptions = {}
): void {
  const elemToScroll = document.scrollingElement || document.documentElement;
  const scrollToPosition =
    element.getBoundingClientRect().top + elemToScroll.scrollTop + offset;

  animateScroll(elemToScroll, scrollToPosition, opts);
}

export function animateScroll(
  element: HTMLElement | Element,
  scrollToPosition: number,
  opts: IScrollOptions = {}
): void {
  opts.duration = opts.duration || 320;
  opts.smoothness = opts.smoothness || 8; // less is more (frames)
  opts.onCompleted = opts.onCompleted || (() => {});

  const start = element.scrollTop;
  const change = scrollToPosition - start;
  const increment = opts.smoothness;
  const duration = opts.duration;

  doScroll(0);

  function doScroll(elapsedTime: number): void {
    elapsedTime += increment;
    var position = easeInOut(elapsedTime, start, change, duration);
    element.scrollTop = position;

    if (elapsedTime < duration) {
      setTimeout(function() {
        doScroll(elapsedTime);
      }, increment);
    } else {
      // this.ngZone.run(() => {
      opts.onCompleted();
      // });
    }
  }
}

function easeInOut(currentTime, start, change, duration): number {
  currentTime /= duration / 2;
  if (currentTime < 1) {
    return (change / 2) * currentTime * currentTime + start;
  }

  currentTime -= 1;
  return (-change / 2) * (currentTime * (currentTime - 2) - 1) + start;
}
