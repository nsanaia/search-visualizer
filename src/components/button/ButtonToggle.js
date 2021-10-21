import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./Button.css";

export default function ButtonToggle({icon, label, onValueChange, enabled = true, value = false}) {
    const [checked, setChecked] = useState(value);

    useEffect(() => {
        setChecked(value);
    }, [value]);

    function onClick() {
        if (!enabled)
            return;
        onValueChange(checked);
        setChecked(!checked);
    }

    return (
        <button className={`button ${enabled ? 'enabled' : 'disabled'} ${checked ? "checked" : ""}`}
                onClick={onClick}>
            {icon && <FontAwesomeIcon icon={icon}/>}
            {label && <span className={icon && "extra-right-margin"}>{label}</span>}
        </button>
    );
}