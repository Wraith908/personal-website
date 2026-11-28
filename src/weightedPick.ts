
import type { DataEntry } from './models/DataEntry';
import dataWeights from './data/characterWeights.json';

type Preferences = Record<string, number>;

const profiles: Record<string, Preferences> =
    dataWeights as Record<string, Preferences>;

export function entryWeight(
    entry: DataEntry,
    charType: string
): number {
    const preferences = profiles[charType];

    if (
        charType === 'Character' ||
        !preferences ||
        !entry.tags?.length
    ) {
        return 1;
    }

    const weights = [...new Set(entry.tags)]
        .map(tag => preferences[tag])
        .filter(weight => weight !== undefined);

    if (!weights.length) {
        return 1;
    }

    for (const weight of weights) {
        if (!Number.isFinite(weight) || weight < 0) {
            throw new Error('Invalid character weight');
        }
    }

    if (weights.includes(0)) {
        return 0;
    }

    return Math.exp(
        weights.reduce(
            (sum, weight) => sum + Math.log(weight),
            0
        ) / weights.length
    );
}

export function weightedPick<T extends DataEntry>(
    entries: readonly T[],
    charType: string
): T {
    if (!entries.length) {
        throw new Error('No entries available');
    }

    if (charType === 'Character') {
        return entries[
            Math.floor(Math.random() * entries.length)
        ];
    }

    const candidates = entries
        .map(entry => ({
            entry,
            weight: entryWeight(entry, charType)
        }))
        .filter(candidate => candidate.weight > 0);

    const total = candidates.reduce(
        (sum, candidate) => sum + candidate.weight,
        0
    );

    if (total <= 0) {
        throw new Error('No eligible entries');
    }

    let roll = Math.random() * total;

    for (const candidate of candidates) {
        roll -= candidate.weight;

        if (roll < 0) {
            return candidate.entry;
        }
    }

    return candidates[candidates.length - 1].entry;
}
