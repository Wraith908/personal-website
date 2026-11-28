
import {
    describe,
    it,
    expect,
    vi,
    afterEach
} from 'vitest';

import {
    entryWeight,
    weightedPick
} from './weightedPick';

import type { DataEntry } from './models/DataEntry';

const neutral: DataEntry = {
    text: 'a blacksmith',
    tags: []
};

const hero: DataEntry = {
    text: 'a protector',
    tags: ['altruistic']
};

const villain: DataEntry = {
    text: 'a tyrant',
    tags: ['cruel']
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Entry weighting', () => {
    it('leaves Character selection unrestricted', () => {
        expect(entryWeight(hero, 'Character')).toBe(1);
        expect(entryWeight(villain, 'Character')).toBe(1);
    });

    it('assigns neutral entries a weight of one', () => {
        expect(entryWeight(neutral, 'Hero')).toBe(1);
        expect(entryWeight(neutral, 'Villain')).toBe(1);
    });

    it('supports entries without tags', () => {
        expect(
            entryWeight({ text: 'a farmer' }, 'Hero')
        ).toBe(1);
    });

    it('favours altruistic heroes', () => {
        expect(entryWeight(hero, 'Hero')).toBeGreaterThan(1);
    });

    it('favours cruel villains', () => {
        expect(
            entryWeight(villain, 'Villain')
        ).toBeGreaterThan(1);
    });

    it('reduces inappropriate weights without excluding entries', () => {
        const weight = entryWeight(villain, 'Hero');

        expect(weight).toBeGreaterThan(0);
        expect(weight).toBeLessThan(1);
    });

    it('combines weights using the geometric mean', () => {
        const entry = {
            text: 'a conqueror',
            tags: ['ambition', 'power', 'leadership']
        };

        expect(
            entryWeight(entry, 'Villain')
        ).toBeCloseTo(Math.cbrt(3 * 4 * 2));
    });

    it('ignores tags without defined preferences', () => {
        expect(
            entryWeight({
                text: 'a protector',
                tags: ['altruistic', 'artisan']
            }, 'Hero')
        ).toBe(entryWeight(hero, 'Hero'));
    });

    it('does not count repeated tags twice', () => {
        expect(
            entryWeight({
                text: 'a conqueror',
                tags: ['power', 'power', 'ambition']
            }, 'Villain')
        ).toBeCloseTo(Math.sqrt(4 * 3));
    });
});

describe('Weighted selection', () => {
    it('rejects empty datasets', () => {
        expect(() => weightedPick([], 'Hero')).toThrow();
    });

    it('returns the only available entry', () => {
        expect(weightedPick([hero], 'Hero')).toBe(hero);
    });

    it('selects uniformly for Character', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.4);

        expect(
            weightedPick(
                [neutral, hero, villain],
                'Character'
            )
        ).toBe(hero);
    });

    it('selects according to cumulative weights', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.4);

        expect(
            weightedPick(
                [neutral, villain],
                'Villain'
            )
        ).toBe(villain);
    });

    it('handles the start of the random range', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        expect(
            weightedPick([neutral, hero], 'Hero')
        ).toBe(neutral);
    });

    it('handles the end of the random range', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999);

        expect(
            weightedPick([neutral, hero], 'Hero')
        ).toBe(hero);
    });

    it('preserves the complete selected entry', () => {
        const entry: DataEntry = {
            text: 'on a quest',
            tags: ['exploration'],
            relationship: {
                connector: 'for',
                targets: ['patron']
            }
        };

        expect(weightedPick([entry], 'Hero')).toBe(entry);
    });
});
