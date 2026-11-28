
import fs from 'node:fs';

const datasets = {
    race: 'Race',
    class: 'Class',
    background: 'Background',
    challenge: 'Challenge',
    goal: 'Goal',
    patron: 'Patron',
    surnames: 'Surnames'
} as const;

function canonicalise(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(canonicalise);
    }

    if (value !== null && typeof value === 'object') {
        const object = value as Record<string, unknown>;

        return Object.fromEntries(
            Object.keys(object)
                .sort()
                .map(key => [
                    key,
                    canonicalise(object[key])
                ])
        );
    }

    return value;
}

let totalDuplicates = 0;

for (const [name, key] of Object.entries(datasets)) {
    const path = `src/data/${name}.json`;

    const root = JSON.parse(
        fs.readFileSync(path, 'utf8')
    );

    const entries: unknown[] = root[key];

    if (!Array.isArray(entries)) {
        throw new Error(`Invalid dataset: ${path}`);
    }

    const seen = new Map<string, number>();
    let duplicates = 0;

    entries.forEach((entry, index) => {
        const fingerprint = JSON.stringify(
            canonicalise(entry)
        );

        const previous = seen.get(fingerprint);

        if (previous !== undefined) {
            console.error(
                `${path}: duplicate entries ` +
                `${previous + 1} and ${index + 1}`
            );

            console.error(JSON.stringify(entry));

            duplicates++;
        } else {
            seen.set(fingerprint, index);
        }
    });

    totalDuplicates += duplicates;

    console.log(`${name}: ${duplicates} duplicates`);
}

console.log(`\nTotal duplicates: ${totalDuplicates}`);

if (totalDuplicates > 0) {
    console.warn(
        `WARNING: ${totalDuplicates} duplicate entries found.`
    );
}
