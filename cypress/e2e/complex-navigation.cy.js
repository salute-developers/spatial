/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('leaveFor', () => {
    before(() => {
        cy.visit('/leave-for/callback');
    });

    it('переход не происходит, выполняется callback', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{rightArrow}');
        cy.focused().type('{rightArrow}');
        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's1f1');
        cy.window().then((win) => {
            // leaveForCallCounter — мок для проверки leaveFor
            cy.wrap(win.leaveForCallCounter).should('eq', 3);
        });
    });

    it('выполняется переход на секцию по имени секции', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's2f0');
    });

    it('выполняется переход по querySelector', () => {
        cy.get('#s1f0').click();

        cy.focused().type('{upArrow}');
        cy.focused().should('have.id', 's2f1');
    });

    it('выполняется переход на конкретный элемент', () => {
        cy.get('#s1f4').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's2f1');
    });
});

describe('restrict self-only', () => {
    before(() => {
        cy.visit('/restrict/self-only');
    });

    it('происходит переход только по собственной секции', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's1f1');
        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's1f2');
    });
});

describe('restrict self-first и none', () => {
    before(() => {
        cy.visit('/restrict/self-first');
    });

    it('происходит переход через элемент чужой секции, несмотря на то, что он ближе', () => {
        cy.get('#s1f0').click({ force: true });

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's1f1');
    });

    it('переход из чужой секции с restrict=none происходит на ближайший элемент', () => {
        cy.get('#s2f0').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's1f1');

        cy.get('#s2f0').click();

        cy.focused().type('{upArrow}');
        cy.focused().should('have.id', 's1f0');
    });
});

describe('выключенные секции', () => {
    before(() => {
        cy.visit('/disabled-section');
    });

    it('нельзя перейти на выключенную секцию', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's1f1');
    });

    it('нельзя переходить внутри выключенной секции', () => {
        cy.get('#s2f1').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's1f2');
    });
});

describe('простые секции навигация по колонкам (секции располагаются по бокам)', () => {
    before(() => {
        cy.visit('/simple-sections/horizontal-column');
    });

    it('можно переключаться внутри простой секции', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's1f2');
        cy.focused().type('{upArrow}');
        cy.focused().should('have.id', 's1f1');
    });

    it('происходит переход в соседнюю секцию', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's2f1');
    });
});

describe('простые секции навигация по колонкам (секции располагаются друг под другом)', () => {
    before(() => {
        cy.visit('/simple-sections/vertical-column');
    });

    it('можно переключаться внутри простой секции', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's1f2');
        cy.focused().type('{upArrow}');
        cy.focused().should('have.id', 's1f1');
    });

    it('происходит переход в соседнюю секцию', () => {
        cy.get('#s1f4').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's2f0');
    });
});

describe('простые секции навигация по рядам (секции располагаются по бокам)', () => {
    before(() => {
        cy.visit('/simple-sections/horizontal-row');
    });

    it('можно переключаться внутри простой секции', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's1f2');
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's1f1');
    });

    it('происходит переход в соседнюю секцию', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's2f1');
    });
});

describe('простые секции навигация по рядам (секции располагаются друг под другом)', () => {
    before(() => {
        cy.visit('/simple-sections/vertical-row');
    });

    it('можно переключаться внутри простой секции', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's1f2');
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's1f1');
    });

    it('происходит переход в соседнюю секцию', () => {
        cy.get('#s1f1').click();

        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's2f1');
    });
});
