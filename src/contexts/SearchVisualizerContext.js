import React, {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState
} from "react";
import {usePrevious} from "../hooks/usePrevious";
import {getInitialGrid} from "../algorithm/gridHelper";
import {search, searchWithoutSleep} from "../algorithm/algorithm";
import {BFS} from "../algorithm/algorithmType";
import {NONE, WALL} from "../algorithm/nodeStatus";
import {IDLE, PAUSED, SEARCHED, SEARCHING} from "../algorithm/phase";
import {algorithmPossibleValues, speedPossibleValues} from "../algorithm/possibleValues";


const SearchVisualizerContext = createContext();
export const useSearchVisualizer = () => useContext(SearchVisualizerContext);

export default function SearchVisualizerProvider({rowNum, colNum, children}) {
    const [phase, setPhase] = useState(IDLE);
    const prevPhase = usePrevious(phase);
    const isApplicationInPhase = (...targetP) => targetP.includes(phase);
    const phaseRef = useRef();//work around for checking changed phase from async search
    const pauseData = useRef();

    const grid = useRef([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [isErasingWalls, toggleErasingWalls] = useReducer(isErasingWalls => !isErasingWalls, false);
    const draggingNode = useRef(null);
    const getDraggingNode = () => draggingNode.current;
    const setDraggingNode = n => draggingNode.current = n;

    const [algorithm, setAlgorithm] = useState(algorithmPossibleValues.find(e => e.key === BFS));
    const speed = useRef();
    const getSpeed = () => speed.current;
    const setSpeed = val => speed.current = val;

    useEffect(() => {
        onPhaseChange();
    }, [phase]);

    useEffect(() => {
        const [initialGrid, initialStart, initialEnd] = getInitialGrid(rowNum, colNum);
        grid.current = initialGrid;
        setStart(initialStart);
        setEnd(initialEnd);
        setPhase(IDLE);
        phaseRef.current = IDLE;
        pauseData.current = null;
        setSpeed(speedPossibleValues.find(e => e.key === 1));
    }, [rowNum, colNum]);

    async function onPhaseChange() {
        phaseRef.current = phase;

        if ([PAUSED, SEARCHED].includes(prevPhase) && isApplicationInPhase(IDLE))
            clear(true);

        if (isApplicationInPhase(SEARCHING)) {
            if (prevPhase !== PAUSED) {
                pauseData.current = null;
                clear(true);
            }

            const res = await search(algorithm.key,
                grid.current,
                start,
                end,
                () => 10 / getSpeed().key,
                () => phaseRef.current === IDLE,
                () => clear(true),
                () => phaseRef.current === PAUSED,
                data => pauseData.current = data,
                pauseData.current);

            if (res)
                setPhase(SEARCHED);
        }
    }

    function searchImmediately(_start, _end) {
        clear(true);
        searchWithoutSleep(algorithm.key, grid.current, _start, _end);
    }

    function clear(onlyPath) {
        for (const row of grid.current) {
            for (const {status, setStatus, setSearchStatus} of row) {
                setSearchStatus(null);
                if (!onlyPath && status === WALL)
                    setStatus(NONE);
            }
        }
    }

    return (
        <SearchVisualizerContext.Provider value={{
            algorithm,
            setAlgorithm,

            phase,
            isApplicationInPhase,
            search: () => setPhase(SEARCHING),
            stopSearch: () => setPhase(IDLE),
            pauseSearch: () => setPhase(PAUSED),
            resumeSearch: () => setPhase(SEARCHING),

            isErasingWalls,
            toggleErasingWalls,

            grid: grid.current,
            getNode: (row, col) => grid.current[row][col],
            start,
            setStart,
            end,
            setEnd,

            searchImmediately,

            clear,

            getSpeed,
            setSpeed,

            getDraggingNode,
            setDraggingNode
        }}>
            {children}
        </SearchVisualizerContext.Provider>
    );
};