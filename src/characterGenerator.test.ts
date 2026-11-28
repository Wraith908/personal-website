
import {
    describe,
    it,
    expect,
    vi,
    afterEach
} from 'vitest';

import {
    generateCharacter,
    rerollCharacter,
    characterTypes
} from './characterGenerator';

import type {
    RerollField
} from './models/Card';

import { cardReferences } from './models/Card';
import { entryWeight } from './weightedPick';

afterEach(() => {
    vi.restoreAllMocks();
});

const fields: RerollField[] = [
    'firstName',
    'lastName',
    'genderPres',
    'race',
    'charClass',
    'background',
    'goal',
    'challenge',
    'patron'
];

describe('Character generation', () => {
    it.each(characterTypes)(
        'generates a complete %s',
        type => {
            const card = generateCharacter(1, type);

            expect(card.id).toBe(1);
            expect(card.charType).toBe(type);

            for (const field of fields) {
                const value = card[field];

                expect(
                    typeof value === 'string'
                        ? value.trim()
                        : value.text.trim()
                ).not.toBe('');
            }
        }
    );
});

describe('Individual field re-roll', () => {
    it.each(fields)(
        'changes only %s',
        field => {
            const original = generateCharacter(1, 'Hero');

            const before = JSON.stringify(original);

            const updated = rerollCharacter(
                original,
                field
            );

            expect(updated).not.toBe(original);

            const originalValue = original[field];
            const updatedValue = updated[field];

            expect(
                typeof updatedValue === 'string'
                    ? updatedValue
                    : updatedValue.text
            ).not.toBe(
                typeof originalValue === 'string'
                    ? originalValue
                    : originalValue.text
            );

            for (const key of fields) {
                if (key !== field) {
                    expect(updated[key]).toBe(original[key]);
                }
            }

            expect(updated.id).toBe(original.id);
            expect(updated.charType).toBe(original.charType);

            expect(JSON.stringify(original)).toBe(before);
        }
    );

    it.each([
        'background',
        'goal',
        'challenge'
    ] as const)(
        'retains character-type eligibility for %s',
        field => {
            for (const type of characterTypes) {
                let card = generateCharacter(1, type);

                for (let i = 0; i < 20; i++) {
                    card = rerollCharacter(card, field);

                    expect(
                        entryWeight(card[field], type)
                    ).toBeGreaterThan(0);
                }
            }
        }
    );

    it('preserves complete dataset metadata', () => {
        const original = generateCharacter(1, 'Villain');

        const updated = rerollCharacter(
            original,
            'firstName'
        );

        expect(updated.background).toBe(original.background);
        expect(updated.goal).toBe(original.goal);
        expect(updated.challenge).toBe(original.challenge);
        expect(updated.patron).toBe(original.patron);
    });

    it('derives references from current selections', () => {
        const original = {
            ...generateCharacter(1, 'Character'),
            race: {
                text: 'Test ancestry',
                references: [
                    { text: 'OLD-REFERENCE' }
                ]
            }
        };

        expect(cardReferences(original))
            .toContain('OLD-REFERENCE');

        const updated = rerollCharacter(
            original,
            'race'
        );

        expect(cardReferences(updated))
            .not.toContain('OLD-REFERENCE');

        expect(cardReferences(original))
            .toContain('OLD-REFERENCE');
    });

    it('deduplicates identical references', () => {
        const card = {
            ...generateCharacter(1, 'Character'),
            race: {
                text: 'Test ancestry',
                references: [
                    { text: 'TEST-REFERENCE' }
                ]
            },
            charClass: {
                text: 'Test class',
                references: [
                    { text: 'TEST-REFERENCE' }
                ]
            }
        };

        expect(
            cardReferences(card)
                .split('TEST-REFERENCE').length - 1
        ).toBe(1);
    });

    it('terminates when first-name generation repeats', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        const original = generateCharacter(1, 'Character');

        const updated = rerollCharacter(
            original,
            'firstName'
        );

        expect(updated.firstName).toBe(original.firstName);
    });
});
