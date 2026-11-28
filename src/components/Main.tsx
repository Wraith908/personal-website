
import '../mainstyle.css';

import {
    useState,
    useEffect,
    useRef
} from 'react';

import type { FormEvent } from 'react';

import {
    subscribeToUpdates,
    applyAvailableUpdate
} from '../pwaUpdates';

import CharCard from './Card';

import type {
    Card,
    RerollField
} from '../models/Card';

import {
    characterTypes,
    generateCharacter,
    rerollCharacter
} from '../characterGenerator';

import AppLogo from '../media/AppLogo.png';

export default function Main() {
    const [charType, setCharType] =
        useState<string>('Character');

    const [charList, setCharList] =
        useState<Card[]>([]);

    const nextId = useRef(0);

    const [updateAvailable, setUpdateAvailable] =
        useState(false);

    useEffect(() => {
        return subscribeToUpdates(setUpdateAvailable);
    }, []);

    useEffect(() => {
        if (
            updateAvailable &&
            charList.length === 0 &&
            navigator.onLine
        ) {
            applyAvailableUpdate();
        }
    }, [updateAvailable, charList.length]);

    function generateNewChar(event: FormEvent) {
        event.preventDefault();

        const card = generateCharacter(
            nextId.current++,
            charType
        );

        setCharList(previous => [
            card,
            ...previous
        ]);
    }

    function rerollField(
        cardId: number,
        field: RerollField
    ) {
        const current = charList.find(
            card => card.id === cardId
        );

        if (!current) return;

        const replacement = rerollCharacter(
            current,
            field
        );

        setCharList(previous =>
            previous.map(card =>
                card.id === cardId
                    ? replacement
                    : card
            )
        );
    }

    return (
        <main className="main">
            <div className="title">
                <img
                    src={AppLogo}
                    alt="Logo"
                    className="Logo"
                />

                <h1>NPCinator</h1>

                {updateAvailable &&
                    charList.length > 0 && (
                    <button
                        type="button"
                        className="update-button"
                        onClick={applyAvailableUpdate}
                        title="Install the latest version of NPCinator"
                    >
                        Update available
                    </button>
                )}
            </div>

            <br />

            <div className="charform">
                <form onSubmit={generateNewChar}>
                    <label htmlFor="charlist">
                        I need a{' '}
                    </label>

                    <select
                        id="charlist"
                        className="charselect"
                        value={charType}
                        onChange={event =>
                            setCharType(event.target.value)
                        }
                    >
                        {characterTypes.map(type => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>

                    {' '}

                    <button type="submit">
                        Go
                    </button>
                </form>
            </div>

            <div id="CardList" className="cardlist">
                {charList.length === 0 ? (
                    <p>
                        Make a character by pressing the button
                    </p>
                ) : (
                    charList.map(card => (
                        <CharCard
                            key={card.id}
                            char={card}
                            onReroll={field =>
                                rerollField(card.id, field)
                            }
                        />
                    ))
                )}
            </div>
        </main>
    );
}
