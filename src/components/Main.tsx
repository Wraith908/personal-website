import '../output.css';
import CardList from './CardList';

export default function Main() {
    return(
        <div className = "bg-sky-700">
            <header>
                <h1>App Name</h1>
            </header>
            <body>
                <p>I need a <input list="CharTypes" placeholder = "Character"></input> <button>Go</button></p>
                <datalist id = "CharTypes">
                    <option value = "Character"/>
                    <option value = "Villain"/>
                    <option value = "Lackey"/>
                    <option value = "Monster"/>
                    <option value = "Hero"/>
                    <option value = "Sidekick"/>
                </datalist>
                <CardList />
            </body>
        </div>
    )
}