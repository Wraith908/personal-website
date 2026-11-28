
import { describe, it, expect } from 'vitest';

import race from './race.json';
import charClass from './class.json';
import background from './background.json';
import goal from './goal.json';
import challenge from './challenge.json';
import patron from './patron.json';
import weights from './characterWeights.json';
import surnames from './surnames.json';
import syllables from './syllables.json';

import type { DataEntry } from '../models/DataEntry';

const datasets: Record<string, DataEntry[]> = {
    race: race.Race as DataEntry[],
    class: charClass.Class as DataEntry[],
    background: background.Background as DataEntry[],
    goal: goal.Goal as DataEntry[],
    challenge: challenge.Challenge as DataEntry[],
    patron: patron.Patron as DataEntry[]
};

const validTags = new Set(`
    altruistic selfish cruel honourable deceptive
    ambition wealth power revenge freedom survival
    knowledge duty redemption leadership servitude
    authority outcast loyalty criminal military
    religious arcane commercial artisan scholarly
    political wilderness courageous cowardly
    reckless manipulative compassionate eccentric
    oppression danger hardship supernatural
    corruption exploration
`.trim().split(/\s+/));

const referenceTypes = new Set([
    'ancestry',
    'class',
    'subclass',
    'statblock',
    'background',
    'lore',
    'general'
]);

describe('Dataset integrity', () => {
    for (const [name, entries] of Object.entries(datasets)) {
        it(`${name} contains valid entries`, () => {
            expect(Array.isArray(entries)).toBe(true);
            expect(entries.length).toBeGreaterThan(0);

            for (const entry of entries) {
                expect(typeof entry.text).toBe('string');
                expect(entry.text.trim()).not.toBe('');
            }
        });

        it(`${name} contains valid tags`, () => {
            for (const entry of entries) {
                if (entry.tags === undefined) continue;

                expect(Array.isArray(entry.tags)).toBe(true);

                expect(new Set(entry.tags).size)
                    .toBe(entry.tags.length);

                for (const tag of entry.tags) {
                    expect(
                        validTags.has(tag),
                        `${entry.text}: unknown tag ${tag}`
                    ).toBe(true);
                }
            }
        });

        it(`${name} contains valid references`, () => {
            for (const entry of entries) {
                for (const ref of entry.references ?? []) {
                    expect(
                        ref.text?.trim() ||
                        ref.book?.trim()
                    ).toBeTruthy();

                    if (ref.type !== undefined) {
                        expect(
                            referenceTypes.has(ref.type)
                        ).toBe(true);
                    }
                }
            }
        });

        it(`${name} contains valid relationship metadata`, () => {
            for (const entry of entries) {
                const rel = entry.relationship;

                if (!rel) continue;

                expect(Array.isArray(rel.targets)).toBe(true);

                for (const target of rel.targets) {
                    expect(typeof target).toBe('string');
                    expect(target.trim()).not.toBe('');
                }

                if (rel.connector !== undefined) {
                    expect(typeof rel.connector).toBe('string');
                }
            }
        });
    }

    it('includes tag arrays in all classified datasets', () => {
        for (const name of ['background', 'goal', 'challenge']) {
            for (const entry of datasets[name]) {
                expect(Array.isArray(entry.tags)).toBe(true);
            }
        }
    });

    it('keeps Character preferences unrestricted', () => {
        expect(weights.Character).toEqual({});
    });

    it('contains all supported character profiles', () => {
        expect(Object.keys(weights).sort()).toEqual([
            'Character',
            'Hero',
            'Lackey',
            'Sidekick',
            'Villain'
        ]);
    });

    it('contains valid character weights', () => {
        for (const profile of Object.values(weights)) {
            for (const [tag, weight] of Object.entries(profile)) {
                expect(validTags.has(tag)).toBe(true);
                expect(typeof weight).toBe('number');
                expect(Number.isFinite(weight)).toBe(true);
                expect(weight).toBeGreaterThanOrEqual(0);
            }
        }
    });

    it('contains valid surnames', () => {
        expect(surnames.Surnames.length).toBeGreaterThan(0);

        for (const name of surnames.Surnames) {
            expect(typeof name).toBe('string');
            expect(name.trim()).not.toBe('');
        }
    });

    it('contains valid name syllables', () => {
        for (const entries of Object.values(syllables)) {
            expect(Array.isArray(entries)).toBe(true);
            expect(entries.length).toBeGreaterThan(0);

            for (const entry of entries) {
                expect(typeof entry).toBe('string');
                expect(entry.trim()).not.toBe('');
            }
        }
    });
});
