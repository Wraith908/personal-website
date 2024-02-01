import '../mainstyle.css';
import { useState, useEffect } from 'react';
import { Card } from '../models/Card';

export default function CharCard(props: {char: Card}) {
    const [charType, setCharType] = useState('');
    const [charName, setCharName] = useState('');
    const [charDescriptor, setCharDescriptor] = useState('');
    const [charHistory, setCharHistory] = useState('');
    const [charMotive, setCharMotive] = useState('');
    const [charReferences, setCharReferences] = useState('');
    
    useEffect(() => {
        setCharType(props.char.header());
        setCharName(props.char.name());
        setCharDescriptor(props.char.shortDescriptor());
        setCharHistory(props.char.charHistory());
        setCharMotive(props.char.motivation());
        setCharReferences(props.char.references());
    })

    return(
        <div className = "card">
            <h3 className="cardName">{charName}</h3><h4 className="cardType">{charType}</h4>
            <p>{charDescriptor} {charHistory} {charMotive}</p>
            <p>References: {charReferences} </p>
        </div>
    )
}