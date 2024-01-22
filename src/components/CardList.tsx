import '../output.css';
import { useState, useEffect } from 'react';
import CharCard from './Card';
import { Card } from '../models/Card';

export default function CardList(props: {charList: Card[]}) {
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        setCards(props.charList)
    })

    return (
        <div id="CardList">
            {props.charList !== null ? 
            (<p>make a character by pressing the button</p>) : 
            (<p>well done</p>)}
        </div>
    )
}