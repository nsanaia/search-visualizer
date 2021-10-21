import {generateRandomNumbers} from "../utils";
import {START, END, NONE} from "./nodeStatus";

export function getInitialGrid(rowNum, colNum) {
    const grid = [];
    for (let r = 0; r < rowNum; r++) {
        grid[r] = [];
        for (let c = 0; c < colNum; c++) {
            grid[r][c] = {
                row: r,
                col: c,
                status: NONE
            };
        }
    }

    const [randStart, randEnd] = generateTwoDistinctNodesInGrid(rowNum, colNum);
    let start = null;
    let end = null;

    if (randStart && randEnd) {
        start = grid[randStart[0]][randStart[1]];
        start.status = START;
        end = grid[randEnd[0]][randEnd[1]];
        end.status = END;
    }

    return [grid, start, end];
}

function generateTwoDistinctNodesInGrid(rowNum, colNum) {
    if (!rowNum || !colNum) {
        return [];
    }
    const first = generateRandomNumbers(rowNum, colNum);
    let second = first;
    while (first[0] === second[0] && first[1] === second[1]) {
        second = generateRandomNumbers(rowNum, colNum);
    }
    return [first, second];
}

