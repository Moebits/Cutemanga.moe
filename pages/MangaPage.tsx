import React, {useEffect, useContext, useReducer, useState} from "react"
import {EnableDragContext} from "../Context"
import PDFControls from "../components/PDFControls"
import PDFRenderer from "../components/PDFRenderer"
import functions from "../structures/Functions"

interface Props {
    match?: any
}

const MangaPage: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const id = props.match.params.id
    const num = props.match.params.num

    useEffect(() => {
        document.title = `${functions.toProperCase(id.replaceAll("-", " "))} ${num}`
        document.body.style.overflowY = "hidden"
        return () => {
            document.body.style.overflowY = "auto"
        }
    }, [])

    return (
        <>
        <PDFControls id={id} num={num}/>
        <div className="content" onMouseEnter={() => setEnableDrag(true)}>
            <PDFRenderer id={id} num={num}/>
        </div>
        </>
    )
}

export default MangaPage