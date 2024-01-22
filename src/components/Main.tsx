import '../output.css';
import { SyntheticEvent, useState } from 'react';
import CharCard from './Card';
import { Card } from '../models/Card';

export default function Main() {
    const [charType, setCharType] = useState<string>('');
    const [charList, setCharList] = useState<Card[]>([]);

    const GenerateNewChar = (e: SyntheticEvent) => {
        /*
            This function generates the card by picking random elements 
            from the JSON lists that are tagged with the charType selected by the user
        */
        e.preventDefault();
        /* verify charType */
        var card = new Card();
        card.setHeader(charType);
        /* randomly determine 
            1. fname and lnam
            2. gender, race and class
            3. problem
            4. goal
            5. patron if applicable
        */
        charList.unshift(card);
        setCharList(charList);
        setCharType('');
    }
    


    return(
        <div>
            <div className="bg-sky-300/20">
                <h1 className="p-2 pl-4 text-xl">Dungeon Master Character Inspiration App</h1>
            </div>
            <br />
            <div>
                <form className="pl-2"  onSubmit={GenerateNewChar}>
                    <p>I need a <input list="CharTypes" placeholder = "Character" value={charType} onChange={e =>setCharType(e.target.value)}/> <button>Go</button></p>
                    <datalist id = "CharTypes">
                        <option value = "Character"/>
                        {/*Villains*/}
                        <option value = "Villain"/>
                        <option value = "Lackey"/>
                        <option value = "Monster"/>
                        {/*Heroes*/}
                        <option value = "Hero"/>
                        <option value = "Sidekick"/>
                    </datalist>
                </form>
                <div id="CardList">
                    {charList.length === 0 ? 
                    (<p className="p-1 pl-2">Make a character by pressing the button</p>) : 
                    (
                        charList.map(charList => {
                            return <CharCard char= {charList}/>
                        })
                    )}
                </div>
            </div>
        </div>
    )
}