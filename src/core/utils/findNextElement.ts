import { getRect } from './getRect';
import { generateDistanceFunctions } from './generateDistanceFunctions';
import { partition } from './partition';
import { prioritize } from './prioritize';
import type { Rect, Priority } from '../types';

export function findNextElement(
    target: HTMLElement,
    direction: string,
    rects: Rect[],
    straightOverlapThreshold: number,
    straightOnly: boolean,
): HTMLElement | null {
    const targetRect = getRect(target);

    const distanceFunction = generateDistanceFunctions(targetRect);

    const groups = partition(rects, targetRect, straightOverlapThreshold);

    const internalGroups = partition(groups[4], targetRect.center, straightOverlapThreshold);

    let priorities: Priority[];

    switch (direction) {
        case 'left':
            priorities = [
                {
                    group: internalGroups[0].concat(internalGroups[3]).concat(internalGroups[6]),
                    distance: [
                        distanceFunction.nearPlumbLineIsBetter.bind(null),
                        distanceFunction.topIsBetter.bind(null),
                    ],
                },
                {
                    group: groups[3],
                    distance: [
                        distanceFunction.nearPlumbLineIsBetter.bind(null),
                        distanceFunction.topIsBetter.bind(null),
                    ],
                },
            ];

            if (straightOnly === false) {
                priorities.push({
                    group: groups[0].concat(groups[6]),
                    distance: [
                        distanceFunction.nearHorizonIsBetter.bind(null),
                        distanceFunction.rightIsBetter.bind(null),
                        distanceFunction.nearTargetTopIsBetter.bind(null),
                    ],
                });
            }

            break;
        case 'right':
            priorities = [
                {
                    group: internalGroups[2].concat(internalGroups[5]).concat(internalGroups[8]),
                    distance: [
                        distanceFunction.nearPlumbLineIsBetter.bind(null),
                        distanceFunction.topIsBetter.bind(null),
                    ],
                },
                {
                    group: groups[5],
                    distance: [
                        distanceFunction.nearPlumbLineIsBetter.bind(null),
                        distanceFunction.topIsBetter.bind(null),
                    ],
                },
            ];

            if (straightOnly === false) {
                priorities.push({
                    group: groups[2].concat(groups[8]),
                    distance: [
                        distanceFunction.nearHorizonIsBetter.bind(null),
                        distanceFunction.leftIsBetter.bind(null),
                        distanceFunction.nearTargetTopIsBetter.bind(null),
                    ],
                });
            }

            break;
        case 'up':
            priorities = [
                {
                    group: internalGroups[0].concat(internalGroups[1]).concat(internalGroups[2]),
                    distance: [
                        distanceFunction.nearHorizonIsBetter.bind(null),
                        distanceFunction.leftIsBetter.bind(null),
                    ],
                },
                {
                    group: groups[1],
                    distance: [
                        distanceFunction.nearHorizonIsBetter.bind(null),
                        distanceFunction.leftIsBetter.bind(null),
                    ],
                },
            ];

            if (straightOnly === false) {
                priorities.push({
                    group: groups[0].concat(groups[2]),
                    distance: [
                        distanceFunction.nearPlumbLineIsBetter.bind(null),
                        distanceFunction.bottomIsBetter.bind(null),
                        distanceFunction.nearTargetLeftIsBetter.bind(null),
                    ],
                });
            }

            break;
        case 'down':
            priorities = [
                {
                    group: internalGroups[6].concat(internalGroups[7]).concat(internalGroups[8]),
                    distance: [
                        distanceFunction.nearHorizonIsBetter.bind(null),
                        distanceFunction.leftIsBetter.bind(null),
                    ],
                },
                {
                    group: groups[7],
                    distance: [
                        distanceFunction.nearHorizonIsBetter.bind(null),
                        distanceFunction.leftIsBetter.bind(null),
                    ],
                },
            ];

            if (straightOnly === false) {
                priorities.push({
                    group: groups[6].concat(groups[8]),
                    distance: [
                        distanceFunction.nearPlumbLineIsBetter.bind(null),
                        distanceFunction.topIsBetter.bind(null),
                        distanceFunction.nearTargetLeftIsBetter.bind(null),
                    ],
                });
            }
            break;
        default:
            return null;
    }

    const destGroups = prioritize(priorities);

    if (!destGroups) {
        return null;
    }

    return destGroups[0].element;
}
