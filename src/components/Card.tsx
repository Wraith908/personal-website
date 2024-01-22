import '../output.css';
import { useState, useEffect } from 'react';
import { Card } from '../models/Card';

export default function CharCard(props: {char: Card}) {
    const [charType, setCharType] = useState('');
    
    useEffect(() => {
        setCharType(props.char.header());
    })

    return(
        <div className="p-2">
            <p>Success, here is a {charType}. </p>

        </div>
    )
}