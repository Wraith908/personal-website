import '../mainstyle.css';
import { SyntheticEvent, useState } from 'react';
/*component imports*/
import CharCard from './Card';
/*model imports*/
import { Card } from '../models/Card';
/*data imports*/
import dataSurname from '../data/surnames.json';
import dataRace from '../data/race.json';
import dataClass from '../data/class.json';
import dataBackground from '../data/background.json';
import dataChallenge from '../data/challenge.json';
import dataGoal from '../data/goal.json';
import dataSyllables from '../data/syllables.json';
import AppLogo from '../media/AppLogo.png';
const vowels = dataSyllables['Vowels'];
const nonvowels = dataSyllables['Non-vowels'];
const endings   = dataSyllables['post-vowel-end-only'];
const surnames = dataSurname['Surnames'];
const races = dataRace['Race'];
const classes = dataClass['Class'];
const backgrounds = dataBackground['Background'];
const challenges = dataChallenge['Challenge'];
const goals = dataGoal['Goal'];
const genders = ['A masculine', 'A feminine', 'An androgynous'];

export default function Main() {
    const [charType, setCharType] = useState<string>('Character');
    const [charList, setCharList] = useState<Card[]>([]);
    const [count, setCount] = useState(0);
    const [inputError, setInputError] = useState(false);


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
            setCount(count + 1);
            card.setHeader(charType);
            /*Name*/
            card.setFirstName(genFirstName());
            card.setLastName(surnames[Math.floor(Math.random() * surnames.length )]);
            /*Ancestry, gender presentation, class*/
            card.setGenderPres(titleCaseWord(genders[Math.floor(Math.random() * genders.length)]));
            card.setRace(races[Math.floor(Math.random() * races.length)]);
            var classIndex = Math.floor(Math.random() * classes.length);
            card.setClass(classes[classIndex][0]);
            card.addReference(classes[classIndex][1])
            /*Background, personal quirk*/
            card.setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
            card.setChallenge(challenges[Math.floor(Math.random() * challenges.length)][0]);
            card.setGoal(goals[Math.floor(Math.random() * goals.length)][0]);
            charList.unshift(card);
            setCharList(charList);
            setInputError(false);
        } else {
            setInputError(true);
        }
        
    }
    


    return(
        <div className = "main">
            <div  className = "title">
                <img src = {AppLogo} alt = "Logo" className = "Logo"/>
                <h1>Dungeon Master Character Inspiration App</h1>
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
                            {/*<option value = "Monster"/>*/}
                            {/*Heroes*/}
                            <option value = "Hero">Hero</option>
                            <option value = "Sidekick">Sidekick</option>
                        </select> <button>Go</button>
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