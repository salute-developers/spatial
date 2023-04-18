import {
    getCurrentFocusedElement,
    findNextElement,
    isNavKey,
    isFocusable,
    assert,
    getSectionId,
    focusElementWithoutScroll,
    focusSectionElement,
    getLeaveForElement,
    stopEvent,
    getNextSimpleSectionElement,
    createRects,
    SECTION_ITEM_CLASS_NAME,
} from './utils';
import type { Config, Section, Direction, NavigationKeyCodes } from './types';

const KEY_MAPPING: Record<NavigationKeyCodes, Direction> = {
    ArrowLeft: 'left',
    ArrowUp: 'up',
    ArrowRight: 'right',
    ArrowDown: 'down',
} as const;

function getNull() {
    return null;
}

const mutationObserverOptions = { childList: true, subtree: true };

export class SpatialNavigation {
    private constructor() {
        // приватный конструктор для реализации паттерна singleton
    }

    private static instance: SpatialNavigation | null = null;

    static getInstance(): SpatialNavigation {
        if (this.instance !== null) {
            return this.instance;
        }

        this.instance = new SpatialNavigation();

        return this.instance;
    }

    private readonly globalConfig: Config = {
        straightOnly: false,
        straightOverlapThreshold: 0.5,
        disabled: false,
        getDefaultElement: getNull,
        enterTo: 'calculated',
        leaveFor: null,
        restrict: 'self-first',
        simpleSectionOptions: null,
        selfSection: false,
    };

    private allFocusableItems: HTMLCollectionOf<HTMLElement> | null = null;

    private intersectionObserver: IntersectionObserver | null = null;

    private mutationObserver: MutationObserver | null = null;

    private visibleItems: Set<HTMLElement> = new Set();

    private ready = false;

    private pause = false;

    private sections: Map<string, Section> = new Map();

    private defaultSectionId: string | null = null;

    private lastSectionId: string | null = null;

    private throttleKeyDown = false;

    /** ***************** */
    /* Private Function */
    /** ***************** */
    private focusSection(sectionId: string): boolean {
        const section = this.sections.get(sectionId);

        return section !== undefined && section.config.disabled !== true && focusSectionElement(section, sectionId);
    }

    private focusNext(direction: Direction, currentFocusedElement: HTMLElement, currentSectionId: string): boolean {
        assert(this.allFocusableItems !== null,"Focusable elements missing");

        const currentSection = this.sections.get(currentSectionId);

        assert(currentSection !== undefined,`Unable to find section with ${currentSectionId} id`);

        if (currentSection.config.simpleSectionOptions !== null) {
            const nextSimpleSectionElement = getNextSimpleSectionElement(
                direction,
                currentFocusedElement,
                currentSection.config.simpleSectionOptions,
            );

            if (nextSimpleSectionElement !== null && isFocusable(nextSimpleSectionElement) === true) {
                focusElementWithoutScroll(nextSimpleSectionElement);

                return true;
            }
        }

        const combinedConfig = {
            ...this.globalConfig,
            ...currentSection.config,
        };

        const { straightOnly, straightOverlapThreshold } = combinedConfig;

        const ignoreSet = new WeakSet<HTMLElement>();

        ignoreSet.add(currentFocusedElement);

        for (const [, section] of this.sections) {
            if (section.config.disabled === true) {
                for (const element of section.sectionElements) {
                    ignoreSet.add(element);
                }
            }
        }

        let next: HTMLElement | null;

        if (
            currentSection.config.disabled === false &&
            (combinedConfig.restrict === 'self-only' || combinedConfig.restrict === 'self-first')
        ) {
            const currentSectionNavigableElements = currentSection.sectionElements;

            // exclude(currentSectionNavigableElements, currentFocusedElement)
            const currentSectionRects = createRects(currentSectionNavigableElements, ignoreSet);

            next = findNextElement(
                currentFocusedElement,
                direction,
                currentSectionRects,
                straightOverlapThreshold,
                straightOnly,
            );

            if (next === null && combinedConfig.restrict === 'self-first') {
                // exclude(allNavigableElements, currentSectionNavigableElements)
                const visibleRects = createRects(this.visibleItems, ignoreSet);

                next = findNextElement(
                    currentFocusedElement,
                    direction,
                    visibleRects,
                    straightOverlapThreshold,
                    straightOnly,
                );

                // fallback to default
                if (next === null) {
                    const allRects = createRects(this.allFocusableItems, ignoreSet);

                    next = findNextElement(
                        currentFocusedElement,
                        direction,
                        allRects,
                        straightOverlapThreshold,
                        straightOnly,
                    );
                }
            }
        } else {
            // exclude(allNavigableElements, currentFocusedElement)
            const visibleRects = createRects(this.visibleItems, ignoreSet);

            next = findNextElement(
                currentFocusedElement,
                direction,
                visibleRects,
                straightOverlapThreshold,
                straightOnly,
            );

            if (next === null) {
                const allRects = createRects(this.allFocusableItems, ignoreSet);

                next = findNextElement(
                    currentFocusedElement,
                    direction,
                    allRects,
                    straightOverlapThreshold,
                    straightOnly,
                );
            }
        }

        // следующий элемент найден
        if (next !== null) {
            const nextSectionId = getSectionId(next);

            if (nextSectionId === null) {
                return false;
            }

            const nextSection = this.sections.get(nextSectionId);

            assert(nextSection !== undefined,`Unable to find section with ${nextSectionId} id`);

            if (currentSectionId !== nextSectionId) {
                const elementFromLeaveFor = getLeaveForElement(currentSection, direction);

                switch (elementFromLeaveFor.type) {
                    case 'no-spatnav-navigation': {
                        return false;
                    }
                    case 'section-name': {
                        const focused = this.focusSection(elementFromLeaveFor.result);
                        if (focused) {
                            return focused;
                        }
                        break;
                    }
                    case 'query-selector': {
                        const element = document.querySelector<HTMLElement>(elementFromLeaveFor.result);

                        if (element !== null && isFocusable(element) === true) {
                            focusElementWithoutScroll(element);

                            return true;
                        }

                        break;
                    }
                    case 'element': {
                        const element = elementFromLeaveFor.result;

                        if (isFocusable(element) === true) {
                            focusElementWithoutScroll(element);

                            return true;
                        }

                        break;
                    }
                    case 'fallback-to-spatnav':
                    default:
                        break;
                }

                const enterTo = nextSection.config.enterTo;

                if (enterTo === 'last-focused' && nextSection.lastFocusedElement !== null) {
                    focusElementWithoutScroll(nextSection.lastFocusedElement);

                    return true;
                }

                const defaultElement = nextSection.config.getDefaultElement(nextSection.rootElement, nextSectionId);

                if (enterTo === 'default-element' && defaultElement) {
                    focusElementWithoutScroll(defaultElement);

                    return true;
                }
            }

            focusElementWithoutScroll(next);

            return true;
        }

        // следующий элемент не найден
        const elementFromLeaveFor = getLeaveForElement(currentSection, direction);

        switch (elementFromLeaveFor.type) {
            case 'no-spatnav-navigation': {
                return false;
            }
            case 'section-name': {
                const focused = this.focusSection(elementFromLeaveFor.result);
                if (focused) {
                    return focused;
                }
                break;
            }
            case 'query-selector': {
                const element = document.querySelector<HTMLElement>(elementFromLeaveFor.result);

                if (element !== null && isFocusable(element) === true) {
                    focusElementWithoutScroll(element);

                    return true;
                }

                break;
            }
            case 'element': {
                const element = elementFromLeaveFor.result;

                if (isFocusable(element) === true) {
                    focusElementWithoutScroll(element);

                    return true;
                }

                break;
            }
            case 'fallback-to-spatnav':
            default:
                break;
        }

        return false;
    }

    private setThrottleKeyDown = (): void => {
        this.throttleKeyDown = false;
    };

    private onKeyDown(event: KeyboardEvent): boolean {
        if (this.throttleKeyDown === true) {
            return stopEvent(event);
        }

        window.requestAnimationFrame(this.setThrottleKeyDown);

        this.throttleKeyDown = true;

        if (this.sections.size === 0 || this.pause) {
            return false;
        }

        const code = event.code || event.key;

        const direction = isNavKey(code) ? KEY_MAPPING[code] : null;

        if (direction === null) {
            return false;
        }

        const currentFocusedElement = getCurrentFocusedElement();

        if (currentFocusedElement === null) {
            if (typeof this.lastSectionId === 'string') {
                this.focusSection(this.lastSectionId);

                return stopEvent(event);
            }

            if (typeof this.defaultSectionId === 'string') {
                this.focusSection(this.defaultSectionId);

                return stopEvent(event);
            }

            for (const [id, section] of this.sections) {
                if (section.config.disabled === false) {
                    focusSectionElement(section, id);
                }
            }

            return stopEvent(event);
        }

        const currentSectionId = getSectionId(currentFocusedElement);

        if(currentSectionId === null){
            return false;
        }
        this.focusNext(direction, currentFocusedElement, currentSectionId);

        return stopEvent(event);
    }

    private onFocus(event: FocusEvent): void {
        const element = event.target;

        if (element instanceof HTMLElement && isFocusable(element)) {
            const sectionId = getSectionId(element);

            if (sectionId !== null) {
                const section = this.sections.get(sectionId);

                if (section !== undefined) {
                    section.lastFocusedElement = element;

                    this.lastSectionId = sectionId;
                }
            }
        }
    }

    private boundedOnKeyDown = this.onKeyDown.bind(this);

    private boundedOnFocus = this.onFocus.bind(this);

    /** ***************** */
    /* Public Function */
    /** ***************** */

    /**
     * Включает навигацию:
     * - устанавливает секцию по умолчанию, если был передан параметр
     * - добавляет EventListener'ы на window для работы навигации
     * - включает IntersectionObserver и MutationObserver, следящие за видимыми элементами на экране
     *
     * @param defaultSectionId
     */
    init(defaultSectionId: string | null = null): void {
        if (this.ready === true) {
            return;
        }

        this.defaultSectionId = defaultSectionId;
        this.allFocusableItems = document.body.getElementsByClassName(
            SECTION_ITEM_CLASS_NAME,
        ) as HTMLCollectionOf<HTMLElement>;

        const intersectionObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting === true) {
                    this.visibleItems.add(entry.target as HTMLElement);
                } else {
                    this.visibleItems.delete(entry.target as HTMLElement);
                }
            }
        });

        for (const element of this.allFocusableItems) {
            intersectionObserver.observe(element);
        }

        const mutationObserver = new MutationObserver((mutationRecords) => {
            for (const record of mutationRecords) {
                if (record.type === 'childList') {
                    for (const added of record.addedNodes) {
                        if (added instanceof HTMLElement && added.classList.contains(SECTION_ITEM_CLASS_NAME)) {
                            intersectionObserver.observe(added);
                        }
                    }

                    for (const removed of record.removedNodes) {
                        if (removed instanceof HTMLElement && removed.classList.contains(SECTION_ITEM_CLASS_NAME)) {
                            intersectionObserver.unobserve(removed);
                        }
                    }
                }
            }
        });

        for (const [, section] of this.sections) {
            mutationObserver.observe(section.rootElement, mutationObserverOptions);
        }

        this.intersectionObserver = intersectionObserver;
        this.mutationObserver = mutationObserver;

        window.addEventListener('keydown', this.boundedOnKeyDown);
        window.addEventListener('focus', this.boundedOnFocus, true);
        this.ready = true;
    }

    /**
     * Выключает навигацию:
     * - удаляет все секции
     * - удаляет все EventListener'ы из window
     * - удаляет секцию по умолчанию
     * - удаляет последнюю активную секцию
     * - выключает IntersectionObserver и MutationObserver, следящие за элементами видимыми на экране
     */
    unInit(): void {
        window.removeEventListener('keydown', this.boundedOnKeyDown);
        window.removeEventListener('focus', this.boundedOnFocus, true);
        if (this.intersectionObserver !== null) {
            this.intersectionObserver.disconnect();
        }
        if (this.mutationObserver !== null) {
            this.mutationObserver.disconnect();
        }
        this.allFocusableItems = null;
        this.intersectionObserver = null;
        this.mutationObserver = null;
        this.visibleItems.clear();
        this.ready = false;
        this.pause = false;
        this.sections.clear();
        this.defaultSectionId = null;
        this.lastSectionId = null;
        this.throttleKeyDown = false;
    }

    /**
     *  Кастомизация глобального конфига SpatialNavigation
     *
     * @param config
     */
    customizeGlobalConfig(config: Config): void {
        Object.assign(this.globalConfig, config);
    }

    /**
     * Проверяет существует ли секция в spatnav instance.
     *
     * @param sectionId
     *
     * @returns `true` если секция существует
     */
    has(sectionId: string): boolean {
        return this.sections.has(sectionId);
    }

    /**
     * @param sectionId
     *
     * @returns Section или undefined если секции с таким id нет
     */
    get(sectionId: string): Section | null {
        return this.sections.get(sectionId) || null;
    }

    /**
     * Перезаписывает конфиг секции с помощью Object.assign
     *
     * @param sectionId
     *
     * @param config
     */
    set(sectionId: string, config: Partial<Config> = {}): void {
        const section = this.sections.get(sectionId);

        if (section) {
            Object.assign(section.config, config);
        }
    }

    /**
     * Добавляет секцию в spatnav instance. После добавления она сразу доступна для навигации.
     *
     * @param sectionId
     *
     * @param config
     *
     * @returns секция
     */
    add(sectionId: string, config?: Partial<Config>): void {
        if (this.sections.has(sectionId) === true) {
            return;
        }

        const rootElement = document.getElementById(sectionId);

        assert(rootElement !== null, `Unable to get element by id=${sectionId}. Section with id ${sectionId} was not created.`);

        let sectionElements: HTMLCollectionOf<HTMLElement> | Set<HTMLElement>;

        if (config?.selfSection === true) {
            sectionElements = new Set();
            sectionElements.add(rootElement);
        } else {
            sectionElements = rootElement.getElementsByClassName(
                SECTION_ITEM_CLASS_NAME,
            ) as HTMLCollectionOf<HTMLElement>;
        }

        if (this.mutationObserver !== null) {
            this.mutationObserver.observe(rootElement, mutationObserverOptions);
        }

        if (this.intersectionObserver !== null) {
            for (const element of sectionElements) {
                this.intersectionObserver.observe(element);
            }
        }

        const section: Section = {
            lastFocusedElement: null,
            config: { ...this.globalConfig, ...config },
            rootElement,
            sectionElements,
        };

        this.sections.set(sectionId, section);
    }

    /**
     * Удаляет секцию из spatnavInstance.
     *
     * @param sectionId
     *
     * @returns `true` если секция была удалена
     */
    remove(sectionId: string): boolean {
        const deleted = this.sections.delete(sectionId);

        if (deleted && this.lastSectionId === sectionId) {
            this.lastSectionId = null;
        }

        if (deleted && this.defaultSectionId === sectionId) {
            this.defaultSectionId = null;
        }

        return deleted;
    }

    /**
     * Выключает навигацию в данной секции.
     *
     * @param sectionId
     *
     * @returns `true` если секция была выключена
     */
    disable(sectionId: string): boolean {
        const section = this.sections.get(sectionId);

        if (section) {
            section.config.disabled = true;

            return true;
        }

        return false;
    }

    /**
     * Включает навигацию в данной секции.
     *
     * @param sectionId
     *
     * @returns `true` если секция была включена
     */
    enable(sectionId: string): boolean {
        const section = this.sections.get(sectionId);

        if (section) {
            section.config.disabled = false;

            return true;
        }

        return false;
    }

    /**
     * Выключает навигацию полностью.
     */
    pauseNavigation(): void {
        this.pause = true;
    }

    /**
     * Включает навигацию полностью.
     */
    resumeNavigation(): void {
        this.pause = false;
    }

    /**
     * Фокусирует секцию с указанным sectionId или на defaultSection.
     *
     * @param sectionId
     */
    focus(sectionId = this.defaultSectionId): boolean {
        if (typeof sectionId === 'string') {
            return this.focusSection(sectionId);
        }

        return false;
    }

    /**
     * Перемещает фокус в указанном направлении как будто была нажата кнопка (вверх, вниз итд.) от текущего активного элемента
     *
     * @param direction - направление перехода
     *
     * @returns - произошёл ли переход
     */
    move(direction: Direction): boolean {
        const element = getCurrentFocusedElement();

        if (element === null) {
            return false;
        }

        const sectionId = getSectionId(element);

        if (sectionId === null) {
            return false;
        }

        return this.focusNext(direction, element, sectionId);
    }

    /**
     * Устанавливает секцию по умолчанию
     *
     * @param sectionId
     */
    setDefaultSection(sectionId: string): void {
        assert(this.sections.has(sectionId) === true,`Unable to set default section because section with ${sectionId} not found`);

        this.defaultSectionId = sectionId;
    }

    /**
     * Забыть последний элемент в данной секции
     *
     * @param sectionId
     */
    forgetLastElementInSection(sectionId: string): void {
        const section = this.sections.get(sectionId);

        if (section !== undefined) {
            section.lastFocusedElement = null;
        }
    }
}
