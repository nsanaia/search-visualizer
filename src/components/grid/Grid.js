import React, {useState} from "react";
import {getEventTargetData} from "../../utils";
import {useSearchVisualizer} from "../../contexts/SearchVisualizerContext";
import {IDLE, SEARCHED} from "../../algorithm/phase";
import {END, NONE, START, WALL} from "../../algorithm/nodeStatus";
import Cell from "./Cell";
import "./Grid.css";


export default function Grid() {
    const {
        isApplicationInPhase,
        isErasingWalls,
        grid,
        getNode,
        start,
        end,
        searchImmediately,
        getDraggingNode,
        setDraggingNode
    } = useSearchVisualizer();

    const [wallingMode, setWallingMode] = useState(false);

    function onDragOver(e) {
        const {row, col} = getEventTargetData(e);
        if (!row || !col)
            return;

        const node = getNode(row, col);
        const dragNode = getDraggingNode();
        if (!node || !dragNode)
            return;

        if ([START, END].includes(dragNode.status)) {
            const isStartDrag = dragNode.status === START;
            if ([WALL, (isStartDrag ? END : START)].includes(node.status))
                return;

            if (dragNode !== (isStartDrag ? start : end))
                dragNode.setStatus(NONE);

            setDraggingNode(node);
            node.setStatus(isStartDrag ? START : END);

            if (isApplicationInPhase(SEARCHED)) {
                if (isStartDrag) searchImmediately(node, end);
                else searchImmediately(start, node);
            }
        }
    }

    function onMouseDown(e) {
        const {row, col, canchangestatus} = getEventTargetData(e);
        if (isApplicationInPhase(IDLE, SEARCHED) && row && col && canchangestatus) {
            setWallingMode(true);
            changeNodeWallStatus(getNode(row, col));
        }
    }

    function onMouseMove(e) {
        const {row, col, canchangestatus} = getEventTargetData(e);
        if (wallingMode && isApplicationInPhase(IDLE, SEARCHED) && row && col && canchangestatus)
            changeNodeWallStatus(getNode(row, col));
    }

    function onMouseUp(e) {
        setWallingMode(false);
    }

    function changeNodeWallStatus(node) {
        if (!isErasingWalls && node.status === NONE)
            node.setStatus(WALL);
        if (isErasingWalls && node.status === WALL)
            node.setStatus(NONE);

        if (isApplicationInPhase(SEARCHED))
            searchImmediately(start, end);
    }

    return (
        <div className="grid__wrapper">
            <div className="grid"
                 onMouseDown={onMouseDown}
                 onMouseMove={onMouseMove}
                 onMouseUp={onMouseUp}
                 onDragOver={onDragOver}>
                {grid.map((row, rowId) =>
                    <div key={`r-${rowId}`} className="grid__row">
                        {row.map((col, colId) =>
                            <Cell key={`n-${rowId}-${colId}`}
                                  row={rowId}
                                  col={colId}
                                  _status={getNode(rowId, colId).status}/>
                        )}
                    </div>)}
            </div>
        </div>);
}