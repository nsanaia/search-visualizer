import React, {useEffect, useState} from "react";
import {useSearchVisualizer} from "../../contexts/SearchVisualizerContext";
import {END, NONE, START} from "../../algorithm/nodeStatus";
import {IDLE, SEARCHED} from "../../algorithm/phase";
import {getCellClassname, getCellIcon} from "./cellHelper";
import "./Cell.css"


export default function Cell({row, col}) {
    const {
        grid,
        isApplicationInPhase,
        getNode,
        setStart,
        setEnd,
        getDraggingNode,
        setDraggingNode
    } = useSearchVisualizer();

    const [status, setStatus] = useState(NONE);
    const [searchStatus, setSearchStatus] = useState();
    const [dir, setDir] = useState();
    const [hasTransition, setHasTransition] = useState(true);

    useEffect(() => {
        const node = getNode(row, col);
        node.setStatus = s => {
            getNode(row, col).status = s;
            setStatus(s);
            setHasTransition(true);
        };
        node.setSearchStatus = (s, dir, trans = true) => {
            node.searchStatus = s;
            node.dir = dir;
            setSearchStatus(s);
            setDir(dir);
            setHasTransition(trans);
        };

        node.setStatus(getNode(row, col).status);
        node.setSearchStatus(getNode(row, col).searchStatus, getNode(row, col).dir);
    }, [grid, row, col]);

    const canDrag = () => isApplicationInPhase(IDLE, SEARCHED);

    function allowDrop(e) {
        if (canDrag())
            e.preventDefault();
    }

    function onDragEnd(e) {
        e.preventDefault();
        const dragNode = getDraggingNode();
        getNode(row, col).setStatus(NONE);

        if (status === START) {
            setStart(dragNode);
            dragNode.setStatus(START);
        } else {//if (status === END)
            setEnd(dragNode);
            dragNode.setStatus(END);
        }
        setDraggingNode(null);
    }

    if ([START, END].includes(status)) {
        return (
            <div className={getCellClassname(status, searchStatus)}
                 data-row={row}
                 data-col={col}
                 onDragOver={allowDrop}>
                <div className={`full-width-height ${canDrag() ? 'draggable' : ''}`}
                     draggable={canDrag()}
                     onDragStart={() => setDraggingNode(getNode(row, col))}
                     onDragEnd={onDragEnd}>
                    {getCellIcon(status, searchStatus, dir)}
                </div>
            </div>
        );
    }

    return (
        <div className={getCellClassname(status, searchStatus, hasTransition)}
             data-row={row}
             data-col={col}
             data-canchangestatus={true}
             onDrop={e => e.preventDefault()}
             onDragOver={allowDrop}
             onDragEnter={allowDrop}
             onDragStart={e => e.preventDefault()}>
            {getCellIcon(status, searchStatus, dir)}
        </div>
    );
}
