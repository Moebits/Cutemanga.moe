import React, {useEffect, useContext, useReducer, useState} from "react"
import {EnableDragContext} from "../Context"
import TitleBar from "../components/TitleBar"
import SideBar from "../components/SideBar"
import Sortbar from "../components/Sortbar"
import MangaGrid from "../components/MangaGrid"
import Footer from "../components/Footer"
import DonationDialog from "../dialogs/DonationDialog"

const HiddenPage: React.FunctionComponent = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    useEffect(() => {
        document.title = "CuteManga: Read Manga with OCR text"
    }, [])

    return (
        <>
        <DonationDialog/>
        <TitleBar rerender={forceUpdate} hidden={true}/>
        <div className="body">
            <SideBar hidden={true}/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <Sortbar/>
                <MangaGrid hidden={true}/>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default HiddenPage