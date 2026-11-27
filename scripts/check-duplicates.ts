
import fs from 'node:fs';

const files = [
  'race',
  'class',
  'background',
  'challenge',
  'goal',
  'patron',
  'surnames'
];

interface EntryLocation {
  line: number;
  content: string;
}

let totalDuplicates = 0;

for (const name of files) {
  const path = `src/data/${name}.json`;
  const lines = fs.readFileSync(path, 'utf8')
    .split(/\r?\n/);

  const seen = new Map<string, EntryLocation>();
  let duplicates = 0;

  lines.forEach((line, index) => {
    const trimmed = line.trim().replace(/,$/, '');

    let entry: unknown;

    try {
      entry = JSON.parse(trimmed);
    } catch {
      return;
    }

    if (
      typeof entry !== 'string' &&
      !Array.isArray(entry)
    ) {
      return;
    }

    const key = JSON.stringify(entry);
    const previous = seen.get(key);

    if (previous) {
      if (duplicates === 0) {
        console.log(`\n${path}`);
      }

      console.log(
        `  Line ${previous.line}: ${previous.content}`
      );
      console.log(
        `  Line ${index + 1}: ${line.trim()}`
      );
      console.log('');

      duplicates++;
    } else {
      seen.set(key, {
        line: index + 1,
        content: line.trim()
      });
    }
  });

  totalDuplicates += duplicates;

  console.log(`${name}: ${duplicates} duplicates`);
}

console.log(`\nTotal duplicates: ${totalDuplicates}`);
