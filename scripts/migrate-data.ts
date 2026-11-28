
import fs from 'node:fs';
import type {
    DataEntry,
    PatronEntry
} from '../src/models/DataEntry.ts';

const apply = process.argv.includes('--apply');

const datasets = {
    race: 'Race',
    class: 'Class',
    background: 'Background',
    goal: 'Goal',
    challenge: 'Challenge',
    patron: 'Patron'
} as const;

type Dataset = keyof typeof datasets;

function convert(
    name: Dataset,
    row: unknown
): DataEntry | PatronEntry | null {

    if (name === 'background') {
        if (typeof row !== 'string' || !row.trim()) {
            throw new Error('Invalid background entry');
        }

        return { text: row };
    }

    // Known empty patron record, already ignored
    // by the current generator.
    if (name === 'patron' && row === '') {
        return null;
    }

    if (
        !Array.isArray(row) ||
        !row.every(value => typeof value === 'string') ||
        !row[0]?.trim()
    ) {
        throw new Error(
            `Unexpected entry: ${JSON.stringify(row)}`
        );
    }

    const [text, second, third, fourth] = row;

    switch (name) {
        case 'race':
        case 'class': {
            const valid =
                row.length === 2 ||
                (
                    name === 'class' &&
                    row.length === 3 &&
                    third === 'NPC'
                );

            if (!valid) {
                throw new Error(
                    `Unexpected reference: ${JSON.stringify(row)}`
                );
            }

            const entry: DataEntry = { text };

            if (second) {
                entry.references = [{
                    text: second,
                    ...(third === 'NPC'
                        ? { type: 'statblock' as const }
                        : {})
                }];
            }

            return entry;
        }

        case 'goal':
        case 'challenge': {
            if (row.length !== 3) {
                throw new Error(
                    `Unexpected relationship: ${JSON.stringify(row)}`
                );
            }

            const entry: DataEntry = { text };

            if (second || third) {
                entry.relationship = {
                    ...(second
                        ? { connector: second }
                        : {}),
                    targets: third
                        .split(/,|\s+or\s+/i)
                        .map(value => value.trim().toLowerCase())
                        .filter(Boolean),
                    ...(third
                        ? { originalTargets: third }
                        : {})
                };
            }

            return entry;
        }

        case 'patron': {
            if (row.length < 3 || row.length > 4) {
                throw new Error(
                    `Unexpected patron: ${JSON.stringify(row)}`
                );
            }

            return {
                text,
                ...(second ? { type: second } : {}),
                ...(third ? { alignment: third } : {}),
                ...(fourth ? { pantheon: fourth } : {})
            };
        }
    }
}

const pending: {
    path: string;
    content: string;
}[] = [];

for (const name of Object.keys(datasets) as Dataset[]) {
    const path = `src/data/${name}.json`;
    const key = datasets[name];

    const original = JSON.parse(
        fs.readFileSync(path, 'utf8')
    );

    const rows: unknown[] = original[key];

    if (!Array.isArray(rows)) {
        throw new Error(`Missing dataset: ${path}`);
    }

    if (Object.keys(original).length !== 1) {
        throw new Error(`Unexpected root properties: ${path}`);
    }

    const converted: DataEntry[] = [];

    rows.forEach((row, index) => {
        try {
            const entry = convert(name, row);

            if (entry !== null) {
                converted.push(entry);
            } else {
                console.log(
                    `${name}: removed empty entry at index ${index}`
                );
            }
        } catch (error) {
            throw new Error(
                `${path}, entry ${index}: ${String(error)}`
            );
        }
    });

    const seen = new Set<string>();

    for (const entry of converted) {
        const key = JSON.stringify(entry);

        if (seen.has(key)) {
            console.warn(
                `Duplicate after migration: ${name}: ${key}`
            );
        }

        seen.add(key);
    }

    const content = [
        '{',
        `    "${key}": [`,
        converted
            .map(entry => `        ${JSON.stringify(entry)}`)
            .join(',\n'),
        '    ]',
        '}',
        ''
    ].join('\n');

    pending.push({ path, content });

    console.log(
        `${name}: ${rows.length} -> ${converted.length} entries`
    );

    console.log('Sample:', JSON.stringify(converted[0]));
}

// Only write once all datasets have been validated.
if (apply) {
    for (const file of pending) {
        fs.writeFileSync(file.path, file.content);
    }
}

console.log(
    apply
        ? '\nMigration complete.'
        : '\nPreview complete. No files modified.'
);
