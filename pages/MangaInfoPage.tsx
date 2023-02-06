import React, {useEffect, useContext, useReducer, useState} from "react"
import {Switch, Route, Redirect, useHistory, useLocation} from "react-router-dom"
import {EnableDragContext} from "../Context"
import TitleBar from "../components/TitleBar"
import SideBar from "../components/SideBar"
import Sortbar from "../components/Sortbar"
import Footer from "../components/Footer"
import MangaInfo from "../components/MangaInfo"
import VolumeGrid from "../components/VolumeGrid"
import DonationDialog from "../dialogs/DonationDialog"
import functions from "../structures/Functions"
import database from "../json/database"
import hiddenDatabase from "../json/database-hidden"

interface Props {
    match?: any
}

const MangaInfoPage: React.FunctionComponent<Props> = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const history = useHistory()

    const id = props.match.params.id
    let info = database.find((m) => m.id === id)
    if (!info) info = hiddenDatabase.find((m) => m.id === id)
    if (!info) {
        history.push(`/404`)
        return null
    }

    useEffect(() => {
        document.title = `${functions.toProperCase(id.replaceAll("-", " "))}`
    }, [])

    return (
        <>
        <DonationDialog/>
        <TitleBar rerender={forceUpdate} hidden={info.hidden}/>
        <div className="body">
            <SideBar hidden={info.hidden}/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <MangaInfo info={info}/>
                <VolumeGrid info={info}/>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default MangaInfoPage