import React, {useEffect, useRef, useState} from "react";
import {useClickOutside} from "../../hooks/useClickOutside";
import "./ComboBox.css"


export default function ComboBox({label, possibleValues, value, onValueChange, enabled = true}) {
    const [opened, setOpened] = useState(false);
    const [selected, setSelected] = useState(value);

    const thisRef = useRef(null);
    useClickOutside(thisRef, () => setOpened(false));

    useEffect(() => {
        setSelected(value);
    }, [value]);

    function onSelect(v) {
        setSelected(v);
        setOpened(false);
        if (onValueChange)
            onValueChange(v);
    }

    function onClick() {
        if (!enabled)
            return;
        setOpened(!opened);
    }

    let val = selected ? selected.label : null;
    return (
        <div className="dropdown" ref={thisRef}>
            <div className={`dropdown__label ${enabled ? 'enabled' : 'disabled'} ${opened ? 'opened' : ''}`}
                 onClick={onClick}>
                {<span className="dropdown__label-label">{`${label}: `}</span>}
                {val && <span className="dropdown__label-value">{val}</span>}
            </div>
            {opened
            && <div className="dropdown__menu">
                {(!possibleValues || !possibleValues.length)
                    ? <div className="dropdown__empty-submenu">List is empty...</div>
                    : <ul className="dropdown__submenu">
                        {possibleValues.map(posVal =>
                            <li key={posVal.key}
                                className={selected && selected.key === posVal.key ? "selected" : ""}
                                onClick={() => onSelect(posVal)}>
                                <span>{posVal.label}</span>
                            </li>)}
                    </ul>}
            </div>}
        </div>
    );
}