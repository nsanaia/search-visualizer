import {DIJKSTRA, BFS, DFS, GREEDY, A_STAR} from "./algorithmType";

export const speedPossibleValues = [
    {key: 0.25, label: '0.25X'},
    {key: 0.5, label: '0.5X'},
    {key: 0.75, label: '0.75X'},
    {key: 1, label: 'Normal'},
    {key: 1.25, label: '1.25X'},
    {key: 1.5, label: '1.5X'},
    {key: 1.75, label: '1.75X'},
    {key: 2, label: '2X'},
];

export const algorithmPossibleValues = [
    {key: DIJKSTRA, label: 'Dijkstra'},
    {key: BFS, label: 'BFS'},
    {key: DFS, label: 'DFS'},
    {key: GREEDY, label: 'Greedy'},
    {key: A_STAR, label: 'A*'},
];