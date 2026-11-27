
import fs from 'node:fs';

const apply = process.argv.includes('--apply');

function normalise(text: string): string {
    return text.trim()
        .replace(/[.!?]+$/, '')
        .replace(/^is\b/i, 'are')
        .replace(/^was\b/i, 'were')
        .replace(/^has\b/i, 'have')
        .replace(/^doesn't\b/i, "don't")
        .replace(/^does not\b/i, 'do not');
}

for (const name of ['goal', 'challenge']) {
    const path = `src/data/${name}.json`;
    const original = fs.readFileSync(path, 'utf8');
    const lines = original.split(/\r?\n/);

    let changed = 0;

    const updated = lines.map((line, index) => {
        let entry: unknown;

        try {
            entry = JSON.parse(
                line.trim().replace(/,$/, '')
            );
        } catch {
            return line;
        }

        if (!Array.isArray(entry) ||
            typeof entry[0] !== 'string') {
            return line;
        }

        const before = entry[0];
        const after = normalise(before);

        if (before === after) return line;

        changed++;

        console.log(`${name}:${index + 1}`);
        console.log(`  Before: They ${before}`);
        console.log(`  After:  They ${after}`);

        entry[0] = after;

        const indent = line.match(/^\s*/)?.[0] ?? '';
        const comma = line.trim().endsWith(',') ? ',' : '';

        return indent + JSON.stringify(entry) + comma;
    });

    if (apply) {
        fs.writeFileSync(path, updated.join('\n'));
    }

    console.log(`${name}: ${changed} changes`);
}

console.log(apply ? 'Changes saved.' : 'Preview only.');
