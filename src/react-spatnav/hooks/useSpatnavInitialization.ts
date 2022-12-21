/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, DependencyList } from 'react';
import { spatnavInstance } from '../../core';

const emptyDependencyList: DependencyList = [];

function unInitSpatnav() {
    spatnavInstance.unInit();
}

function initSpatnav() {
    spatnavInstance.init();

    return unInitSpatnav;
}

/**
 * Инициализирует навигацию.
 *
 * Используется только один раз. Удобнее всего использовать в корневом компоненте.
 *
 * По умолчанию будет в фокусе первая добавленная секция
 */
export function useSpatnavInitialization(): void {
    useEffect(initSpatnav, emptyDependencyList);
}
