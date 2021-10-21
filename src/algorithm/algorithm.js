import {sleep} from "../utils";
import {END, NONE, PATH, START, TO_VISIT, VISITED, VISITING} from "./nodeStatus";
import {DOWN, LEFT, RIGHT, UP} from "./direction";
import {A_STAR, DFS, GREEDY} from "./algorithmType";


export async function search(algoType,
                             grid,
                             start,
                             end,
                             getSleepTime,
                             isStop,
                             stop,
                             isPaused,
                             pause,
                             savedNodes) {
    const res = await searchInternal(algoType, grid, start, end, getSleepTime, isStop, stop, isPaused, pause, savedNodes);
    if (!res)
        return false;
    if (res.isPath) {
        for (const [i, node] of res.path.entries()) {
            node.setSearchStatus(PATH, getDirection(node, res.path[i + 1]));
            await sleep(getSleepTime());
        }
    }
    return true;
}


export function searchWithoutSleep(algoType, grid, start, end) {
    const res = searchInternalWithoutSleep(algoType, grid, start, end);
    if (!res)
        return false;
    if (res.isPath) {
        for (const [i, node] of res.path.entries())
            node.setSearchStatus(PATH, getDirection(node, res.path[i + 1]), false);
    }
    return true;
}

async function searchInternal(algoType,
                              grid,
                              start,
                              end,
                              getSleepTime,
                              isStop,
                              stop,
                              isPaused,
                              pause,
                              savedNodes) {
    let nodes = savedNodes || [makeNodeWithPath(start, [])];

    while (nodes.length) {
        if (isStop()) {
            stop();
            return;
        }

        const {node: curr, path: currPath} = getNextNode(algoType, nodes, end);
        if (curr.status === END)
            return {isPath: true, path: currPath};
        if (curr.searchStatus === VISITED)
            continue;
        curr.setSearchStatus(VISITING);
        await sleep(getSleepTime());

        if (isPaused()) {
            putNextNodeBack(algoType, nodes, {node: curr, path: currPath});
            pause(nodes);
            return;
        }

        for (let n of getValidNeighbours(grid, curr)) {
            nodes.push(makeNodeWithPath(n, currPath));
            if (algoType !== DFS) {
                n.setSearchStatus(TO_VISIT);
                await sleep(getSleepTime());
            }
        }

        curr.setSearchStatus(VISITED);
        await sleep(getSleepTime());
    }

    return {isPath: false};
}


function searchInternalWithoutSleep(algoType,
                                    grid,
                                    start,
                                    end) {

    let nodes = [makeNodeWithPath(start, [])];

    while (nodes.length) {
        const {node: curr, path: currPath} = getNextNode(algoType, nodes, end);
        if (curr.row === end.row && curr.col === end.col)
            return {isPath: true, path: currPath};
        if (curr.searchStatus === VISITED)
            continue;

        for (let n of getValidNeighbours(grid, curr))
            nodes.push(makeNodeWithPath(n, currPath));

        curr.setSearchStatus(VISITED, null, false);
    }

    return {isPath: false};
}

function makeNodeWithPath(node, alreadyPath) {
    return {node, path: [...alreadyPath, node]};
}

function getNextNode(algoType, nodes, end) {
    if (algoType === DFS)
        return nodes.pop();

    if (algoType === A_STAR || algoType === GREEDY)
        nodes.sort((a, b) => getHeuristicValue(algoType, a, end) - getHeuristicValue(algoType, b, end));

    return nodes.shift();
}

function putNextNodeBack(algoType, nodes, node) {
    if (algoType === DFS)
        nodes.push(node)
    else
        nodes.unshift(node);
}

function getManhattanDistance(a, b) {
    return Math.abs(a.row - a.row) + Math.abs(a.col - b.col);
}

function getHeuristicValue(algoType, {node, path}, end) {
    if (algoType === GREEDY)
        return getManhattanDistance(node, end);
    if (algoType === A_STAR)
        return path.length + getManhattanDistance(node, end);
}

function getValidNeighbours(grid, node) {
    const neighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    let ans = [];

    for (let [dr, dc] of neighbours) {
        let row = node.row + dr;
        let col = node.col + dc;

        if (inBounds(row, 0, grid.length)
            && inBounds(col, 0, grid[0].length)
            && [NONE, END, START].includes(grid[row][col].status)
            && !grid[row][col].searchStatus) {

            ans.push(grid[row][col]);
        }
    }

    return ans;
}

function inBounds(index, min, max) {
    return index >= min && index < max;
}

function getDirection(a, b) {
    if (!b)
        return null;
    if (b.row > a.row)
        return DOWN;
    if (b.row < a.row)
        return UP;
    if (b.col > a.col)
        return RIGHT;
    if (b.col < a.col)
        return LEFT;
}
