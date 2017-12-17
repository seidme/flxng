export function debounce(fn: Function, wait: number, immediate: boolean): Function {
    let timeout;           

    return function() {
        let ctx = this;
        let args = arguments;

        let callNow = immediate && !timeout;

        clearTimeout(timeout);   

        timeout = setTimeout(function() {
             timeout = null;

             if (!immediate) {
               fn.apply(ctx, args);
             }
        }, wait);

        if (callNow) {
            fn.apply(ctx, args);  
        }
     }; 
};