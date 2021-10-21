import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import "./Button.css";


export default function Button({icon, label, onClick, enabled = true}) {
    function onClickWrapper() {
        if (enabled && onClick)
            onClick();
    }

    return (
        <button className={`button ${enabled ? 'enabled' : 'disabled'}`}
                onClick={onClickWrapper}>
            {icon && <FontAwesomeIcon icon={icon}/>}
            {label && <span className={icon && "extra-right-margin"}>{label}</span>}
        </button>
    );
}