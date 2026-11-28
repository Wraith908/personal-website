import '../mainstyle.css';
import { SyntheticEvent, useState, useEffect } from 'react';

import {
  subscribeToUpdates,
  applyAvailableUpdate
} from '../pwaUpdates';

/*component imports*/
import CharCard from './Card';
/*model imports*/
import { Card } from '../models/Card';
import type {
    DataEntry,
    PatronEntry
} from '../models/DataEntry';
/*data imports*/
import dataSurname from '../data/surnames.json';
import dataRace from '../data/race.json';
import dataClass from '../data/class.json';
import dataBackground from '../data/background.json';
import dataChallenge from '../data/challenge.json';
import dataGoal from '../data/goal.json';
import dataSyllables from '../data/syllables.json';
import dataPatron from '../data/patron.json';
import { weightedPick } from '../weightedPick';
import AppLogo from '../media/AppLogo.png';
const vowels = dataSyllables['Vowels'];
const nonvowels = dataSyllables['Non-vowels'];
const endings   = dataSyllables['post-vowel-end-only'];
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

export default function Main() {
    const [charType, setCharType] = useState<string>('Character');
    const [charList, setCharList] = useState<Card[]>([]);
    const [count, setCount] = useState(0);
    const [inputError, setInputError] = useState(false);

    const [updateAvailable, setUpdateAvailable] = useState(false);

    // Receive update notifications from Workbox.
    useEffect(() => {
      return subscribeToUpdates(setUpdateAvailable);
    }, []);

    // Automatically update only when there are no cards.
    useEffect(() => {
      if (
        updateAvailable &&
        charList.length === 0 &&
        navigator.onLine
      ) {
        applyAvailableUpdate();
      }
    }, [updateAvailable, charList.length]);

    const GenerateNewChar = (e: SyntheticEvent) => {
        /*
            This function generates the card by picking random elements 
            from the JSON lists that are tagged with the charType selected by the user
        */
        e.preventDefault();
        /* verify charType */
        enum charTypes {'Character','Villain','Lackey','Monster','Hero','Sidekick'};
        var tightrope: boolean;
        tightrope = false;
        Object.values(charTypes).forEach((value) => {
            if (value === charType) {tightrope = true}
        })
        if (tightrope) {
            var card = new Card();
            card.setID(count);
            setCount(previous => previous + 1);
            card.setHeader(charType);
            /*Name*/
            card.setFirstName(genFirstName());
            card.setLastName(surnames[Math.floor(Math.random() * surnames.length )]);
            
            /* Ancestry, gender presentation, class */
            card.setGenderPres(
                titleCaseWord(randomEntry(genders))
            );

            const race = randomEntry(races);
            card.setRace(race.text);
            addReferences(card, race);

            const charClass = randomEntry(classes);
            card.setClass(charClass.text);
            addReferences(card, charClass);

            /* Background, goal, challenge and patron */
            card.setBackground(
                weightedPick(backgrounds, charType).text
            );

            card.setChallenge(
                weightedPick(challenges, charType).text
            );

            card.setGoal(
                weightedPick(goals, charType).text
            );
            card.setPatron(randomEntry(patrons).text);
            
            setCharList(previous => [card, ...previous]);
            setInputError(false);
        } else {
            setInputError(true);
        }
        
    }

    return(
        <div className = "main">
            <div  className = "title">
                <img src = {AppLogo} alt = "Logo" className = "Logo"/>
                <h1>NPCinator</h1>

                {updateAvailable && charList.length > 0 && (
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
            <div>
                <div  className = "charform">
                    <form onSubmit={GenerateNewChar}>
                        <label>I need a </label>
                        <select id = "charlist" className = "charselect" value={charType} onChange={e =>setCharType(e.target.value)}>
                            <option value = "Character">Character</option>
                            {/*Villains*/}
                            <option value = "Villain">Villain</option>
                            <option value = "Lackey">Lackey</option>
                            {/*<option value = "Monster">Monster</option>*/}
                            {/*Heroes*/}
                            <option value = "Hero">Hero</option>
                            <option value = "Sidekick">Sidekick</option>
                        </select> <button>Go</button>
                        {inputError && <p>An error has occured, please try again</p>}
                    </form>
                    
                </div>
                <div id="CardList" className = "cardlist">
                    {charList.length === 0 ? 
                    (<p>Make a character by pressing the button</p>) : 
                    (
                        charList.map(charList => {
                            return <CharCard char= {charList} key = {charList.id} />
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

function genFirstName(){
    var varFirstName:string;
    var vowelNext:number;
    varFirstName = "";
    vowelNext = Math.round(Math.random());
     
    for (let i = 0; i < 10; i++) {
        if (vowelNext === 1){
            vowelNext = 0;
            varFirstName = varFirstName + vowels[Math.floor(Math.random() * vowels.length)];
        }
        else{
            vowelNext = 1;
            if (i > 2) {
                if (Math.random() > 0.5) {
                    varFirstName = varFirstName + endings[Math.floor(Math.random() * endings.length)];   
                    i = 10; //end     
                }
                else{
                    varFirstName = varFirstName + nonvowels[Math.floor(Math.random() * nonvowels.length)];
                }
            }
            else{
                varFirstName = varFirstName + nonvowels[Math.floor(Math.random() * nonvowels.length)];
            }

        }
        
        if (i > 2) {
            if (Math.random() > 0.5) {
                i = 10; //end 
            }
        }
      }

    return titleCaseWord(varFirstName);
}

function titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

function randomEntry<T>(entries: readonly T[]): T {
    return entries[
        Math.floor(Math.random() * entries.length)
    ];
}

function addReferences(card: Card, entry: DataEntry) {
    for (const reference of entry.references ?? []) {
        const text = reference.text ??
            [reference.book, reference.pages]
                .filter(Boolean)
                .join(' ');

        if (text) {
            card.addReference(text);
        }
    }
}
