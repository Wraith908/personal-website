import '../output.css';
import CardList from './CardList';

export default function Main() {
    return(
        <div>
            <span>
                <h1>Dungeon Master Character Inspiration App</h1>
            </span>
            <div>
                <form>
                    <p>I need a <input list="CharTypes" placeholder = "Character" /> <button>Go</button></p>
                    <datalist id = "CharTypes">
                        <option value = "Character"/>
                        <option value = "Villain"/>
                        <option value = "Lackey"/>
                        <option value = "Monster"/>
                        <option value = "Hero"/>
                        <option value = "Sidekick"/>
                    </datalist>
                </form>
                <CardList />
            </div>
        </div>
    )
}