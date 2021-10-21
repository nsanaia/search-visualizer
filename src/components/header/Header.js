import React from "react";
import {
    faEraser,
    faPause,
    faPlay,
    faTrash,
    faTrashAlt,
    faSearch,
    faStop,
} from '@fortawesome/free-solid-svg-icons'
import {useSearchVisualizer} from "../../contexts/SearchVisualizerContext";
import {algorithmPossibleValues, speedPossibleValues} from "../../algorithm/possibleValues";
import {IDLE, PAUSED, SEARCHED, SEARCHING} from "../../algorithm/phase";
import ComboBox from "../comboBox/ComboBox"
import Button from "../button/Button";
import ButtonToggle from "../button/ButtonToggle";
import "./Header.css";


const HEADER_LABEL = "Search Visualizer";

export default function Header() {
    const {
        isApplicationInPhase,
        algorithm,
        setAlgorithm,
        search,
        stopSearch,
        pauseSearch,
        resumeSearch,
        toggleErasingWalls,
        getSpeed,
        setSpeed,
        clear
    } = useSearchVisualizer();

    return (
        <div className="header">
            <div className="header__label">
                {HEADER_LABEL}
            </div>
            <div className="header__buttons">
                <div style={{width: '5.2em'}}>
                    <ComboBox label="algorithm"
                              possibleValues={algorithmPossibleValues}
                              value={algorithm}
                              onValueChange={algoType => {
                                  stopSearch();
                                  setAlgorithm(algoType);
                              }}
                              enabled={isApplicationInPhase(IDLE, SEARCHED)}/>
                </div>
                <div style={{width: '4.8em'}}>
                    <ComboBox label="speed"
                              possibleValues={speedPossibleValues}
                              value={getSpeed()}
                              onValueChange={setSpeed}/>
                </div>
                <div>
                    {isApplicationInPhase(IDLE, SEARCHED)
                        ? <Button icon={faSearch}
                                  label="Search"
                                  onClick={search}/>
                        : <Button icon={faStop}
                                  label="Stop"
                                  onClick={stopSearch}/>
                    }
                </div>
                <div>
                    <Button icon={isApplicationInPhase(PAUSED) ? faPlay : faPause}
                            onClick={isApplicationInPhase(PAUSED) ? resumeSearch : pauseSearch}
                            enabled={isApplicationInPhase(SEARCHING, PAUSED)}/>
                </div>
                <div>
                    <ButtonToggle icon={faEraser}
                                  onValueChange={toggleErasingWalls}
                                  enabled={isApplicationInPhase(IDLE, SEARCHED)}/>
                </div>
                <div>
                    <Button icon={faTrashAlt}
                            label="Clear Path"
                            onClick={() => {
                                stopSearch();
                                clear(true);
                            }}
                            enabled={isApplicationInPhase(IDLE, SEARCHED)}/>
                </div>
                <div>
                    <Button icon={faTrash}
                            label="Clear"
                            onClick={() => {
                                stopSearch();
                                clear();
                            }}
                            enabled={isApplicationInPhase(IDLE, SEARCHED)}/>
                </div>
            </div>
        </div>);
};