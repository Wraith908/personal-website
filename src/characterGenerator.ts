
import type {
    Card,
    RerollField
} from './models/Card';

import type {
    DataEntry,
    PatronEntry
} from './models/DataEntry';

import dataSurname from './data/surnames.json';
import dataRace from './data/race.json';
import dataClass from './data/class.json';
import dataBackground from './data/background.json';
import dataChallenge from './data/challenge.json';
import dataGoal from './data/goal.json';
import dataSyllables from './data/syllables.json';
import dataPatron from './data/patron.json';

import {
    weightedPick,
    entryWeight
} from './weightedPick';

const vowels = dataSyllables['Vowels'];
const nonvowels = dataSyllables['Non-vowels'];
const endings = dataSyllables['post-vowel-end-only'];

const surnames = dataSurname['Surnames'];

const races = dataRace['Race'] as DataEntry[];
const classes = dataClass['Class'] as DataEntry[];
const backgrounds = dataBackground['Background'] as DataEntry[];
const challenges = dataChallenge['Challenge'] as DataEntry[];
const goals = dataGoal['Goal'] as DataEntry[];
const patrons = dataPatron['Patron'] as PatronEntry[];

const genders = [
    'A masculine',
    'A feminine',
    'An androgynous'
];

export const characterTypes = [
    'Character',
    'Villain',
    'Lackey',
    'Hero',
    'Sidekick'
] as const;

function randomEntry<T>(entries: readonly T[]): T {
    if (!entries.length) {
        throw new Error('No entries available');
    }

    return entries[
        Math.floor(Math.random() * entries.length)
    ];
}

function differentValue<T>(
    entries: readonly T[],
    current: T
): T {
    const alternatives = entries.filter(
        entry => entry !== current
    );

    return alternatives.length
        ? randomEntry(alternatives)
        : current;
}

function differentEntry<T extends DataEntry>(
    entries: readonly T[],
    current: T
): T {
    const alternatives = entries.filter(
        entry => entry.text !== current.text
    );

    return alternatives.length
        ? randomEntry(alternatives)
        : current;
}

function differentWeightedEntry<T extends DataEntry>(
    entries: readonly T[],
    current: T,
    charType: string
): T {
    const alternatives = entries.filter(
        entry =>
            entry.text !== current.text &&
            entryWeight(entry, charType) > 0
    );

    return alternatives.length
        ? weightedPick(alternatives, charType)
        : current;
}

function titleCaseWord(word: string): string {
    if (!word) return word;

    return word[0].toUpperCase() +
        word.slice(1).toLowerCase();
}

export function genFirstName(): string {
    let firstName = '';
    let vowelNext = Math.round(Math.random());

    for (let i = 0; i < 10; i++) {
        if (vowelNext === 1) {
            vowelNext = 0;
            firstName += randomEntry(vowels);
        } else {
            vowelNext = 1;

            if (i > 2 && Math.random() > 0.5) {
                firstName += randomEntry(endings);
                break;
            }

            firstName += randomEntry(nonvowels);
        }

        if (i > 2 && Math.random() > 0.5) {
            break;
        }
    }

    return titleCaseWord(firstName);
}

function differentFirstName(current: string): string {
    for (let attempt = 0; attempt < 20; attempt++) {
        const candidate = genFirstName();

        if (candidate && candidate !== current) {
            return candidate;
        }
    }

    return current;
}

export function generateCharacter(
    id: number,
    charType: string
): Card {
    return {
        id,
        charType,
        firstName: genFirstName(),
        lastName: randomEntry(surnames),
        genderPres: randomEntry(genders),
        race: randomEntry(races),
        charClass: randomEntry(classes),
        background: weightedPick(backgrounds, charType),
        challenge: weightedPick(challenges, charType),
        goal: weightedPick(goals, charType),
        patron: randomEntry(patrons)
    };
}

export function rerollCharacter(
    card: Card,
    field: RerollField
): Card {
    switch (field) {
        case 'firstName':
            return {
                ...card,
                firstName: differentFirstName(card.firstName)
            };

        case 'lastName':
            return {
                ...card,
                lastName: differentValue(
                    surnames, card.lastName
                )
            };

        case 'genderPres':
            return {
                ...card,
                genderPres: differentValue(
                    genders, card.genderPres
                )
            };

        case 'race':
            return {
                ...card,
                race: differentEntry(races, card.race)
            };

        case 'charClass':
            return {
                ...card,
                charClass: differentEntry(
                    classes, card.charClass
                )
            };

        case 'background':
            return {
                ...card,
                background: differentWeightedEntry(
                    backgrounds,
                    card.background,
                    card.charType
                )
            };

        case 'goal':
            return {
                ...card,
                goal: differentWeightedEntry(
                    goals,
                    card.goal,
                    card.charType
                )
            };

        case 'challenge':
            return {
                ...card,
                challenge: differentWeightedEntry(
                    challenges,
                    card.challenge,
                    card.charType
                )
            };

        case 'patron':
            return {
                ...card,
                patron: differentEntry(patrons, card.patron)
            };
    }
}
