import { Rect } from '../types';
import { getRect } from './getRect';
import { isFocusable } from './isFocusable';

export function createRects(
    candidates: HTMLCollectionOf<HTMLElement> | Set<HTMLElement>,
    ignoreSet: WeakSet<HTMLElement>,
): Rect[] {
    const rects: Rect[] = [];

    for (const element of candidates) {
        if (ignoreSet.has(element) === false && isFocusable(element) === true && element.isConnected === true) {
            const rect = getRect(element);

            rects.push(rect);
        }
    }

    return rects;
}
