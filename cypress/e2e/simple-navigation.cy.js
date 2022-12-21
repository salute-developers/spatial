/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('фокусировка', () => {
    before(() => {
        cy.visit('/vertical');
    });

    it('клик по элементу фокусирует элемент', () => {
        cy.get('#f2').click();
        cy.focused().should('have.id', 'f2');
    });
});

describe('вертикальная навигация', () => {
    before(() => {
        cy.visit('/vertical');
    });

    beforeEach(() => {
        cy.get('#f2').click();
    });

    it('можно перейти на один элемент вниз в рамках секции', () => {
        cy.focused().should('have.id', 'f2');
        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 'f3');
    });

    it('можно перейти на один элемент вверх в рамках секции', () => {
        cy.focused().should('have.id', 'f2');
        cy.focused().type('{upArrow}');
        cy.focused().should('have.id', 'f1');
    });
});

describe('горизонтальная навигация', () => {
    before(() => {
        cy.visit('/horizontal');
    });

    beforeEach(() => {
        cy.get('#f2').click();
    });

    it('можно перейти на один элемент вправо в рамках секции', () => {
        cy.focused().should('have.id', 'f2');
        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 'f3');
    });

    it('можно перейти на один влево в рамках секции', () => {
        cy.focused().should('have.id', 'f2');
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 'f1');
    });
});

describe('навигация между секциями, элементы которых находятся на одной линии друг с другом', () => {
    before(() => {
        cy.visit('/between-sections');
    });

    it('можно перейти на элемент другой секции', () => {
        cy.get('#s1f2').click();
        cy.focused().should('have.id', 's1f2');
        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's2f2');
    });

    it('нельзя перейти на элемент другой секции, если другая секция не находится по направлению нажатой стрелки', () => {
        cy.get('#s1f4').click();
        cy.focused().should('have.id', 's1f4');
        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's1f4');
    });
});

describe('навигация между секциями со смещёнными друг относительно друга элементами', () => {
    before(() => {
        cy.visit('/between-shifted-sections');
    });

    it('происходит навигация в другую секцию, по направлению нажатой стрелки', () => {
        cy.get('#s1f0').click();
        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's2f0');
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's1f1');
    });

    it('происходит навигация в другую секцию, даже если проекции элементов не пересекаются', () => {
        cy.get('#s1f4').click();
        cy.focused().type('{downArrow}');
        cy.focused().should('have.id', 's2f4');
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's1f4');
    });
});

describe('переходы между секциями с параметром straightOnly', () => {
    before(() => {
        cy.visit('/straight-only');
    });

    it('нельзя перейти на элемент в другую секцию, если их проекции не пересекаются больше, чем на 50%', () => {
        cy.get('#s1f0').click();
        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's1f0');

        cy.get('#s2f4').click();
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's2f4');
    });

    it('можно перейти на элемент в другую секцию, если их проекции пересекаются больше, чем на 50%', () => {
        cy.get('#s1f1').click();
        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's2f0');
    });
});

describe('возврат на секцию', () => {
    it('на дефолтный элемент', () => {
        cy.visit('/enter-to/default-element');
        cy.get('#s1f2').click();
        cy.focused().type('{rightArrow}');
        cy.focused().should('have.id', 's2f1');
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's1f2');
    });

    it('на последний активный элемент', () => {
        cy.visit('/enter-to/last-focused');
        cy.get('#s1f2').click();
        cy.focused().type('{rightArrow}');
        cy.focused().type('{downArrow}');
        cy.focused().type('{downArrow}');
        cy.focused().type('{leftArrow}');
        cy.focused().should('have.id', 's1f2');
    });
});
