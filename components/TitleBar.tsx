import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import favicon from "../assets/icons/favicon.png"
import {EnableDragContext, HueContext, SaturationContext, LightnessContext, MobileContext} from "../Context"
import functions from "../structures/Functions"
import color from "../assets/icons/color.png"
import Slider from "react-slider"
import hueIcon from "../assets/icons/hue.png"
import saturationIcon from "../assets/icons/saturation.png"
import lightnessIcon from "../assets/icons/lightness.png"
import "./styles/titlebar.less"

const colorList = {
    "--selection": "rgba(255, 168, 233, 0.302)",
    "--text": "#fd3a9c",
    "--text-alt": "#f141cb",
    "--background": "#380022",
    "--titlebarBG": "#660013",
    "--titlebarText": "#fc2cb7",
    "--titlebarText2": "#b30074",
    "--titlebarTextAlt": "#9c1c37",
    "--sidebarBG": "#240400",
    "--sidebarText": "#b30074",
    "--sidebarButton": "#a3001b",
    "--sidebarLink": "#f21c8e",
    "--sortbarButton": "#b30074",
    "--sortbarSearchBG": "#570038",
    "--gridButton": "#f53dab",
    "--footerBG": "#330021",
    "--pdfControlsBG": "#c70038",
    "--dropdownBG": "rgba(51, 0, 33, 0.95)"
}

const TitleBar: React.FunctionComponent = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {hue, setHue} = useContext(HueContext)
    const {saturation, setSaturation} = useContext(SaturationContext)
    const {lightness, setLightness} = useContext(LightnessContext)
    const [activeDropdown, setActiveDropdown] = useState(false)
    const {mobile, setMobile} = useContext(MobileContext)
    const history = useHistory()

    /*useEffect(() => {
        if (typeof window === "undefined") return
        for (let i = 0; i < Object.keys(colorList).length; i++) {
            const key = Object.keys(colorList)[i]
            const color = Object.values(colorList)[i]
            document.documentElement.style.setProperty(key, functions.rotateColor(color, hue, saturation, lightness))
        }
    }, [hue, saturation, lightness])*/

    const resetFilters = () => {
        setHue(180)
        setSaturation(100)
        setLightness(50)
    }

    const getFilter = () => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = bodyStyles.getPropertyValue("--titlebarText2")
        return functions.calculateFilter(color)
    }

    const titleClick = () => {
        history.push("/")
    }

    return (
        <div className={`titlebar`} onMouseEnter={() => setEnableDrag(false)}>
            <div className="titlebar-logo-container" onClick={titleClick}>
                <span className="titlebar-hover">
                    <div className="titlebar-text-container">
                            <span className="titlebar-text">C</span>
                            <span className="titlebar-text">u</span>
                            <span className="titlebar-text">t</span>
                            <span className="titlebar-text">e</span>
                            <span className="titlebar-text">M</span>
                            <span className="titlebar-text">a</span>
                            <span className="titlebar-text">n</span>
                            <span className="titlebar-text">g</span>
                            <span className="titlebar-text">a</span>
                    </div>
                    <div className="titlebar-image-container">
                        <img className="titlebar-img" src={favicon}/>
                    </div>
                </span>
            </div>
            <div className="titlebar-container">
                <div className="titlebar-nav-container">
                    {!mobile ? <span className="titlebar-nav-text" onClick={() => history.push("/manga")}>Manga</span> : null}
                    {/* <span className="titlebar-nav-text" onClick={() => window.open("https://cuteanime.moe", "_blank")}>Anime</span> */}
                    <span className="titlebar-nav-text" onClick={() => history.push("/about")}>About</span>
                </div>
                {/* <div className="titlebar-nav-container">
                    <img className="titlebar-nav-icon" src={color} style={{filter: getFilter()}} onClick={() => setActiveDropdown((prev) => !prev)}/>
                </div> */}
            </div>
            <div className={`dropdown ${activeDropdown ? "" : "hide-dropdown"}`}>
                <div className="dropdown-row">
                    {/* <img className="dropdown-icon" src={hueIcon} style={{filter: getFilter()}}/> */}
                    <span className="dropdown-text">Hue</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" onChange={(value) => setHue(value)} min={60} max={300} step={1} value={hue}/>
                </div>
                <div className="dropdown-row">
                    {/* <img className="dropdown-icon" src={saturationIcon} style={{filter: getFilter()}}/> */}
                    <span className="dropdown-text">Saturation</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" onChange={(value) => setSaturation(value)} min={50} max={100} step={1} value={saturation}/>
                </div>
                <div className="dropdown-row">
                    {/* <img className="dropdown-icon" src={lightnessIcon} style={{filter: getFilter()}}/> */}
                    <span className="dropdown-text">Lightness</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" onChange={(value) => setLightness(value)} min={45} max={55} step={1} value={lightness}/>
                </div>
                <div className="dropdown-row">
                    <button className="dropdown-button" onClick={() => resetFilters()}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default TitleBar