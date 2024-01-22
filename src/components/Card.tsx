import '../output.css';
import { useState, useEffect } from 'react';
import { Card } from '../models/Card';

export default function CharCard(props: {char: Card}) {
    const [charType, setCharType] = useState('');
    const [charName, setCharName] = useState('');
    const [charDescriptor, setCharDescriptor] = useState('');
    const [charMotive, setCharMotive] = useState('');
    const [charReferences, setCharReferences] = useState('');
    
    useEffect(() => {
        setCharType(props.char.header());
        setCharName(props.char.name());
        setCharDescriptor(props.char.shortDescriptor());
        setCharMotive(props.char.motivation());
        setCharReferences(props.char.references());
    })

    return(
        <div className="p-2">
            <h3>{charName}, {charType}</h3>
            <p>A {charDescriptor} {charMotive}</p>
            <p>{charReferences}</p>
        </div>
    )
}