import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faArrowUp,
    faFlagCheckered,
    faRunning
} from "@fortawesome/free-solid-svg-icons";
import {END, PATH, START, TO_VISIT, VISITED, VISITING, WALL} from "../../algorithm/nodeStatus";
import {DOWN, LEFT, UP} from "../../algorithm/direction";


export const getCellClassname = (status, searchStatus, hasTransition) => {
    let additionalClass = '';
    if (status === WALL)
        additionalClass = 'cell--wall';
    if (searchStatus === VISITING)
        additionalClass = 'cell--visiting';
    if (searchStatus === TO_VISIT)
        additionalClass = 'cell--to-visit';
    if (searchStatus === VISITED)
        additionalClass = 'cell--visited';
    if (searchStatus === PATH)
        additionalClass = 'cell--path';

    return `cell ${additionalClass} ${hasTransition ? 'cell--transition' : ''}`
}

export const getCellIcon = (status, searchStatus, dir) => {
    if (status === START)
        return <FontAwesomeIcon icon={faRunning} className="cell__icon--normal"/>;
    if (status === END)
        return <FontAwesomeIcon icon={faFlagCheckered} className="cell__icon--normal"/>;
    if (searchStatus === PATH)
        return <FontAwesomeIcon icon={getArrowByDir(dir)} className="cell__icon--extra-small" style={{zIndex: "100"}}/>;
    if (searchStatus === VISITING)
        return <FontAwesomeIcon icon={faRunning} className="cell__icon--small"/>;
    return <></>;
}

const getArrowByDir = (dir) => {
    if (dir === LEFT)
        return faArrowLeft;
    if (dir === UP)
        return faArrowUp;
    if (dir === DOWN)
        return faArrowDown;
    return faArrowRight;
}