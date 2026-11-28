import '../mainstyle.css';
import type { Card, RerollField } from '../models/Card';
import { cardReferences } from '../models/Card';

interface CardProps {
    char: Card;
    onReroll: (field: RerollField) => void;
}

interface FieldProps {
    field: RerollField;
    label: string;
    value: string;
    punctuation?: string;
    onReroll: (field: RerollField) => void;
}

function RerollableField({
    field,
    label,
    value,
    punctuation = '',
    onReroll
}: FieldProps) {
    const words = value.trim().split(/\s+/);
    const lastWord = words.pop() ?? '';
    const prefix = words.join(' ');

    return (
        <span className="rerollable-field">
            <span data-field={field}>
                {prefix && `${prefix} `}
                <span className="field-ending">
                    {lastWord}{punctuation}
                    <button
                        type="button"
                        className="reroll-button"
                        aria-label={`Re-roll ${label}`}
                        title={`Re-roll ${label}`}
                        onClick={() => onReroll(field)}
                    />
                </span>
            </span>
        </span>
    );
}

export default function CharCard({
    char,
    onReroll
}: CardProps) {
    function field(
        key: RerollField,
        label: string,
        value: string,
        punctuation = ''
    ) {
        return (
            <RerollableField
                field={key}
                label={label}
                value={value}
                punctuation={punctuation}
                onReroll={onReroll}
            />
        );
    }

    return (
        <article
            className="card"
            aria-labelledby={`npc-${char.id}-name`}
        >
            <header className="cardHeader">
                <h2
                    className="cardName"
                    id={`npc-${char.id}-name`}
                >
                    {field('firstName', 'first name', char.firstName)}
                    {' '}
                    {field('lastName', 'surname', char.lastName)}
                </h2>
                <span className="cardType">
                    {char.charType}
                </span>
            </header>

            <p className="cardIdentity">
                {field('genderPres', 'gender', char.genderPres)}
                {' '}
                {field('race', 'ancestry', char.race.text)}
                {' and '}
                {field('charClass', 'class', char.charClass.text, '.')}
            </p>

            <p className="cardNarrative">
                {'They were '}
                {field('background', 'background', char.background.text, '.')}
                {' They are '}
                {field('goal', 'goal', char.goal.text, '.')}
                {' They '}
                {field('challenge', 'challenge', char.challenge.text, '.')}
                {' They follow '}
                {field('patron', 'patron', char.patron.text, '.')}
            </p>

            <p className="cardReferences">
                References: {cardReferences(char)}
            </p>
        </article>
    );
}