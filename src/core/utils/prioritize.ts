import type { Priority, Rect } from '../types';

function checkPriorityGroupLength(priority: Priority) {
    return priority.group.length > 0;
}

export function prioritize(priorities: Priority[]): Rect[] | null {
    const destPriority = priorities.find(checkPriorityGroupLength);

    if (destPriority === undefined) {
        return null;
    }

    const destDistance = destPriority.distance;

    destPriority.group.sort((a, b) => {
        for (const distance of destDistance) {
            const delta = distance(a) - distance(b);

            if (delta) {
                return delta;
            }
        }

        return 0;
    });

    return destPriority.group;
}
