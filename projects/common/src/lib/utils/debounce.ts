export function debounce(fn: any, wait: number, immediate: boolean): any {
  let timeout;

  return function () {
    const ctx = this;
    const args = arguments;

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;

      if (!immediate) {
        fn.apply(ctx, args);
      }
    }, wait);

    if (callNow) {
      fn.apply(ctx, args);
    }
  };
}
