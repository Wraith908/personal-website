
export type ReferenceType =
    | 'ancestry'
    | 'class'
    | 'subclass'
    | 'statblock'
    | 'background'
    | 'lore'
    | 'general';

export interface SourceReference {
    text?: string;
    book?: string;
    pages?: string;
    type?: ReferenceType;
}

export interface Relationship {
    connector?: string;
    targets: string[];
    originalTargets?: string;
}

export interface DataEntry {
    text: string;
    tags?: string[];
    references?: SourceReference[];
    relationship?: Relationship;
}

export interface PatronEntry extends DataEntry {
    type?: string;
    alignment?: string;
    pantheon?: string;
}
