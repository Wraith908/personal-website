import '../output.css';
import { useState } from 'react';
import CardList from './CardList';

export default function Main() {
    const [charType, setCharType] = useState<string>('Character');
    return(
        <div>
            <div className="bg-sky-300/20">
                <h1 className="p-2 pl-4 text-xl">Dungeon Master Character Inspiration App</h1>
            </div>
            <br />
            <div>
                <form className="pl-2">
                    <p>I need a <input list="CharTypes" placeholder = "Character" value={charType} onChange={e =>setCharType(e.target.value)}/> <button>Go</button></p>
                    <datalist id = "CharTypes">
                        <option value = "Character"/>
                        {/*villains*/}
                        <option value = "Villain"/>
                        <option value = "Lackey"/>
                        <option value = "Monster"/>
                        {/*Heroes*/}
                        <option value = "Hero"/>
                        <option value = "Sidekick"/>
                    </datalist>
                </form>
                <CardList 
                    charType={charType}
                />
            </div>
        </div>
    )
}