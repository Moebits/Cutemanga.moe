import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import {EnableDragContext, PageContext, ZoomContext, NumPagesFlagContext, MobileContext,
ShowEnContext, HorizontalContext, ShowThumbnailsContext, NavigateFlagContext} from "../Context"
import functions from "../structures/Functions"
import back from "../assets/icons/back.png"
import bookmark from "../assets/icons/bookmark.png"
import comment from "../assets/icons/comment.png"
import dictionary from "../assets/icons/dictionary.png"
import englishToJapanese from "../assets/icons/englishToJapanese.png"
import japaneseToEnglish from "../assets/icons/japaneseToEnglish.png"
import hamburger from "../assets/icons/hamburger.png"
import info from "../assets/icons/info.png"
import nextPage from "../assets/icons/nextPage.png"
import prevPage from "../assets/icons/prevPage.png"
import rightToLeft from "../assets/icons/rightToLeft.png"
import topToBottom from "../assets/icons/topToBottom.png"
import support from "../assets/icons/support.png"
import zoomIn from "../assets/icons/zoomIn.png"
import zoomOut from "../assets/icons/zoomOut.png"
import reset from "../assets/icons/reset.png"
import database from "../json/database"
import "./styles/pdfcontrols.less"

interface Props {
    id: string
}

const PDFControls: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const [lastPage, setLastPage] = useState("1")
    const {page, setPage} = useContext(PageContext)
    const [lastZoom, setLastZoom] = useState("100%")
    const {zoom, setZoom} = useContext(ZoomContext)
    const {numPagesFlag, setNumPagesFlag} = useContext(NumPagesFlagContext)
    const {horizontal, setHorizontal} = useContext(HorizontalContext)
    const {showEn, setShowEn} = useContext(ShowEnContext)
    const {showThumbnails, setShowThumbnails} = useContext(ShowThumbnailsContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {navigateFlag, setNavigateFlag} = useContext(NavigateFlagContext)
    const history = useHistory()

    useEffect(() => {
        const savedThumbnails = localStorage.getItem("showThumbnails")
        const savedHorizontal = localStorage.getItem("horizontal")
        const savedShowEn = localStorage.getItem("showEn")
        const savedZoom = localStorage.getItem("zoom")
        if (savedThumbnails) setShowThumbnails(JSON.parse(savedThumbnails))
        if (savedHorizontal) setHorizontal(JSON.parse(savedHorizontal))
        if (savedShowEn) setShowEn(JSON.parse(savedShowEn))
        if (savedZoom) setZoom(savedZoom)
    }, [])

    useEffect(() => {
        if (mobile) {
            setShowThumbnails(false)
            setZoom("100%")
        }
    }, [mobile])

    useEffect(() => {
        localStorage.setItem("showThumbnails", JSON.stringify(showThumbnails))
        localStorage.setItem("horizontal", JSON.stringify(horizontal))
        localStorage.setItem("showEn", JSON.stringify(showEn))
        localStorage.setItem("zoom", zoom)
    }, [showThumbnails, horizontal, showEn, zoom])

    useEffect(() => {
        if (page && !Number.isNaN(Number(page))) setLastPage(String(Number(page)))
        if (zoom && !Number.isNaN(Number(zoom.replace("%", "")))) setLastZoom(String(Number(zoom.replace("%", "")) + "%"))
    }, [page, zoom])

    const updatePage = () => {
        if (!page || Number.isNaN(Number(page))) return setPage(lastPage)
        setPage(String(Number(page)))
        navigateToPage(Number(page))
    }

    const updateZoom = () => {
        if (!zoom || Number.isNaN(Number(zoom.replace("%", "")))) return setZoom(lastZoom)
        setZoom(String(Number(zoom.replace("%", "")) + "%"))
    }

    const triggerZoomIn = () => {
        if (!zoom) return
        const value = Number(zoom.replace("%", ""))
        if (Number.isNaN(value)) return
        const newValue = Math.round(value * 1.1)
        setZoom(String(newValue) + "%")
    }

    const triggerZoomOut = () => {
        if (!zoom) return
        const value = Number(zoom.replace("%", ""))
        if (Number.isNaN(value)) return
        const newValue = Math.round(value * 0.9)
        setZoom(String(newValue) + "%")
    }

    const triggerBack = () => {
        history.push(`/manga/${props.id}`)
    }

    const triggerSupport = () => {
        const manga = database.find((m) => m.id === props.id)
        if (manga) {
            window.open(manga.website, "_blank")
        }
    }

    const navigateToPage = (page: number, sideways?: boolean) => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        let horizontalVal = sideways !== undefined ? sideways : horizontal
        const value = horizontalVal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!value || !element) return
        if (horizontalVal) {
            element.scrollLeft = -Math.round(((page - 1) * value))
        } else {
            element.scrollTop = Math.round(((page - 1) * value))
        }
    }

    useEffect(() => {
        if (navigateFlag) {
            navigateToPage(navigateFlag)
            setNavigateFlag(null)
        }
    }, [navigateFlag])

    const triggerPrev = () => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        const value = horizontal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!value || !element) return
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (value))) + 1 : Math.round(element.scrollTop / (value)) + 1
        if (horizontal) {
            const newPage = current + 1
            navigateToPage(newPage > numPagesFlag ? numPagesFlag : newPage)
        } else {
            const newPage = current - 1
            navigateToPage(newPage < 1 ? 1 : newPage)
        }
    }

    const triggerNext = () => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        const value = horizontal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!value || !element) return
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (value))) + 1 : Math.round(element.scrollTop / (value)) + 1
        if (horizontal) {
            const newPage = current - 1
            navigateToPage(newPage < 1 ? 1 : newPage)
        } else {
            const newPage = current + 1
            navigateToPage(newPage > numPagesFlag ? numPagesFlag : newPage)
        }
    }

    const changeHorizontal = (value: boolean) => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        const val = horizontal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!val || !element) return
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (val))) + 1 : Math.round(element.scrollTop / (val)) + 1
        setHorizontal(value)
        setTimeout(() => {
            navigateToPage(current, value)
        }, 500)
    }

    return (
        <div className="pdf-controls" onMouseEnter={() => setEnableDrag(false)}>
            <div className="pdf-controls-box">
                {!mobile ? <img className="pdf-controls-icon-small" src={hamburger} onClick={() => setShowThumbnails((prev: boolean) => !prev)}/> : null}
                <div className="pdf-controls-page-container">
                    <span className="pdf-controls-page-text">Page:</span>
                    <input className="pdf-controls-page-input" type="text" spellCheck={false} value={page} onChange={(event) => setPage(event.target.value)} onBlur={() => updatePage()}/>
                    <span className="pdf-controls-page-text">/ {numPagesFlag}</span>
                </div>
                <img className="pdf-controls-icon-mid" src={rightToLeft} onClick={() => changeHorizontal(true)}/>
                <img className="pdf-controls-icon-mid" src={topToBottom} onClick={() => changeHorizontal(false)}/>
            </div>
            {!mobile ?
            <div className="pdf-controls-box">
                <img className="pdf-controls-icon-small-alt" src={zoomOut} onClick={triggerZoomOut}/>
                <img className="pdf-controls-icon-small" src={zoomIn} onClick={triggerZoomIn}/>
                <input className="pdf-controls-zoom-input" type="text" spellCheck={false} value={zoom} onChange={(event) => setZoom(event.target.value)} onBlur={() => updateZoom()}/>
                <img className="pdf-controls-icon-small" src={reset} onClick={() => setZoom("100%")} style={{height: "13px"}}/>
                <img className="pdf-controls-icon-small" src={prevPage} onClick={triggerPrev}/>
                <img className="pdf-controls-icon-small" src={nextPage} onClick={triggerNext}/>
            </div> : null}
            <div className="pdf-controls-box">
                <img className="pdf-controls-icon" src={back} onClick={triggerBack}/>
                {/* <img className="pdf-controls-icon" src={info}/> */}
                {/* <img className="pdf-controls-icon" src={bookmark}/>  */}
                {/* <img className="pdf-controls-icon" src={dictionary}/> */}
                <img className="pdf-controls-icon" src={showEn ? englishToJapanese : japaneseToEnglish} onClick={() => setShowEn((prev: boolean) => !prev)}/>
                {!mobile ? <img className="pdf-controls-icon" src={support} onClick={triggerSupport}/> : null}
                {/* <img className="pdf-controls-icon" src={comment}/> */}
            </div>
        </div>
    )
}

export default PDFControls