
import type {
    DataEntry,
    PatronEntry
} from './DataEntry';

export interface Card {
    id: number;
    charType: string;
    firstName: string;
    lastName: string;
    genderPres: string;
    race: DataEntry;
    charClass: DataEntry;
    background: DataEntry;
    challenge: DataEntry;
    goal: DataEntry;
    patron: PatronEntry;
}

export type RerollField =
    | 'firstName'
    | 'lastName'
    | 'genderPres'
    | 'race'
    | 'charClass'
    | 'background'
    | 'challenge'
    | 'goal'
    | 'patron';

export function cardReferences(card: Card): string {
    const entries = [
        card.race,
        card.charClass,
        card.background,
        card.goal,
        card.challenge,
        card.patron
    ];

    const references = entries.flatMap(entry =>
        (entry.references ?? []).map(reference =>
            reference.text ??
            [reference.book, reference.pages]
                .filter(Boolean)
                .join(' ')
        )
    );

    return [...new Set(
        references.map(text => text.trim()).filter(Boolean)
    )].join(' ');
}
