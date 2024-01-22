import '../output.css';
import { SyntheticEvent, useState } from 'react';
import CharCard from './Card';
import { Card } from '../models/Card';

export default function Main() {
    const [charType, setCharType] = useState<string>('Character');
    const [charList, setCharList] = useState<Card[]>([]);

    const GenerateNewChar = (e: SyntheticEvent) => {
        e.preventDefault();
        var card = new Card();
        card.setHeader(charType);
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
                        <option value = "Main Character"/>
                        <option value = "Supporting Character"/>
                        {/*Villains*/}
                        <option value = "Villain"/>
                        <option value = "Monster"/>
                        {/*Heroes*/}
                        <option value = "Hero"/>
                    </datalist>
                </form>
                <div id="CardList">
                    {charList.length === 0 ? 
                    (<p>make a character by pressing the button</p>) : 
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