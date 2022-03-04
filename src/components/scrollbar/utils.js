export function minmax(value, min, max) {
    if (typeof value !== "number" ||
        typeof min !== "number" ||
        typeof max !== "number") {
        throw Error(`Arguments must be numbers, [${value}, ${min}, ${max}]`);
    }
    if (min > max) {
        throw Error("min must be smaller than max");
    }

    return Math.min(Math.max(min, value), max)
}

/**
 *
 * @param element {HTMLDivElement}
 */
export function realWidth(element) {
    return window.getComputedStyle(element).width;
}

/**
 *
 * @param element {HTMLDivElement}
 */
export function realHeight(element) {
    return window.getComputedStyle(element).height;
}
