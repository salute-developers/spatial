import { Direction, LeaveForGetter } from '../types';

import type { Section } from '../types';

const fallbackOption = { type: 'fallback-to-spatnav', result: null } as const;

export function getLeaveForElement(section: Section, direction: Direction): ReturnType<LeaveForGetter> {
    const leaveForObject = section.config.leaveFor;

    if (leaveForObject === null) {
        return fallbackOption;
    }

    const leaveFor = leaveForObject[direction];

    if (leaveFor === undefined) {
        return fallbackOption;
    }

    return leaveFor(section.rootElement, section.rootElement.id);
}
