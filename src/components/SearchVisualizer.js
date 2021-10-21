import React from "react";
import {useWindowSize} from "../hooks/useWindowSize";
import Grid from "./grid/Grid";
import Header from "./header/Header";
import SearchVisualizerProvider from "../contexts/SearchVisualizerContext";

export default function SearchVisualizer() {
    // TODO [NODO] for smaller screens better sizing!!!
    const [width, height] = useWindowSize();
    console.log("width = " + width);

    const emInPixels = parseFloat(getComputedStyle(document.body).fontSize);
    console.log("parseFloat(getComputedStyle(parentElement).fontSize); = " + emInPixels);
    const cellSize = Math.floor( 1.2 * emInPixels);
    const headerSize = emInPixels * 3;

    let rowNum = (height - headerSize) * 0.96 < cellSize ? 0 : Math.floor((height - headerSize) * 0.96 / cellSize);
    let colNum = width * 0.96 < cellSize ? 0 : Math.floor(width * 0.96 / cellSize);

    console.log("rowNum" + rowNum);
    console.log("colNUm" + colNum);

    return (
        <SearchVisualizerProvider rowNum={rowNum}
                                  colNum={colNum}>
            <Header/>
            <Grid/>
        </SearchVisualizerProvider>
    );
}