import '../output.css';
import { useState, useEffect } from 'react';
import { Card } from '../models/Card';

export default function CharCard(props: {char: Card, key: number}) {
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
        <div className="p-2">
            <h3>{charName}, a {charType}</h3>
            <p>{charDescriptor}, {charHistory} {charMotive}</p>
            <p>References: {charReferences} </p>
        </div>
    )
}