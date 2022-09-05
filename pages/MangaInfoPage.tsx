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

interface Props {
    match?: any
}

const MangaInfoPage: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const history = useHistory()

    const id = props.match.params.id
    const info = database.find((m) => m.id === id)
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
        <TitleBar/>
        <div className="body">
            <SideBar/>
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