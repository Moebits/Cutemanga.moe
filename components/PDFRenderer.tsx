import React, {useContext, useEffect, useState, useRef, useMemo, createRef, forwardRef} from "react"
import {SizeMe} from "react-sizeme"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import {EnableDragContext, PageContext, ZoomContext, NumPagesFlagContext, MobileContext,
ShowEnContext, HorizontalContext, ShowThumbnailsContext, NavigateFlagContext} from "../Context"
import {Document, Page, pdfjs, PDFPageProxy} from "react-pdf"
import functions from "../structures/Functions"
import WrappedPage from "./WrappedPage"
import * as pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry"
import database from "../json/database"
import axios from "axios"
import "./styles/pdfrenderer.less"

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

const Placeholder = ({width}) => {
    const a4AspectRatio = 1.4142
    const height = a4AspectRatio * width
    return <div style={{width: width, height: height}}/>
}

const PDFPage = forwardRef(function PDFPage({visible, pageIndex, width, scale, id}: any, ref: any) {
    const placeholder = <Placeholder width={width}/>
  
    return (
        <div ref={ref} data-page-index={pageIndex}>
          {visible ? (
            <WrappedPage width={width} pageNumber={pageIndex + 1} loading={placeholder} scale={scale} id={id}/>
          ) : placeholder}
        </div>
      )
})

const PDFThumbnail = forwardRef(function PDFThumbnail({visible, pageIndex, width}: any, ref: any) {
    const placeholder = <Placeholder width={width}/>
  
    return (
        <div ref={ref} data-page-index={pageIndex}>
          {visible ? (
            <Page width={width} pageNumber={pageIndex + 1} loading={placeholder} renderAnnotationLayer={false} renderTextLayer={false}/>
          ) : placeholder}
        </div>
      )
})

interface Props {
    id: string
    num: number
    source?: any
}

const PDFRenderer: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {page, setPage} = useContext(PageContext)
    const {zoom, setZoom} = useContext(ZoomContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {numPagesFlag, setNumPagesFlag} = useContext(NumPagesFlagContext)
    const [numPagesJA, setNumPagesJA] = React.useState(0)
    const [numPagesEN, setNumPagesEN] = React.useState(0)
    const [numPagesThumb, setNumPagesThumb] = React.useState(0)
    const [enPDF, setEnPDF] = useState(null) as any
    const [jaPDF, setJaPDF] = useState(null) as any
    const rootRef = useRef(null) as any
    const [observer, setObserver] = useState(null) as any
    const [visibilitiesJA, setVisibilitiesJA] = useState([]) as any
    const [visibilitiesEN, setVisibilitiesEN] = useState([]) as any
    const {showEn, setShowEn} = useContext(ShowEnContext)
    const {horizontal, setHorizontal} = useContext(HorizontalContext)
    const {showThumbnails, setShowThumbnails} = useContext(ShowThumbnailsContext)
    const {navigateFlag, setNavigateFlag} = useContext(NavigateFlagContext)
    const [thumbsRenderedJA, setThumbsRenderedJA] = useState(0) as any
    const [thumbsRenderedEN, setThumbsRenderedEN] = useState(0) as any
    const history = useHistory()

    const id = `${props.id} ${props.num}`

    const loadPDF = async () => {
        if (props.source !== undefined) {
            setJaPDF(props.source)
            return
        }
        const manga = database.find((m) => m.id === props.id)
        if (!manga) return history.push(`/404`)
        const volume = manga.volumes.find((v) => v.volumeNumber === Number(props.num))
        if (!volume) return history.push(`/404`)
        setJaPDF(volume.japaneseSource)
        setEnPDF(volume.englishSource)
    }
    
    useEffect(() => {
        loadPDF()
    }, [])

    useEffect(() => {
        loadPDF()
    }, [props.source])

    useEffect(() => {
        const keyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault()
                setShowEn((prev: boolean) => !prev)
            }
        }
        window.addEventListener("keydown", keyDown)
        return () => {
            window.removeEventListener("keydown", keyDown)
        }
    })

    const pageRefsJA = useMemo(() => {
        return Array.from(new Array(numPagesJA), () => createRef())
    }, [numPagesJA])

    const pageRefsEN = useMemo(() => {
        return Array.from(new Array(numPagesEN), () => createRef())
    }, [numPagesEN])

    const getScale = () => {
        if (!zoom) return 1
        const value = Number(zoom?.replace("%", "")) / 100
        if (!value || Number.isNaN(value)) return 1
        return value
    }
    
    let amount = 1600 / getScale()

    const observerOptions = {
        root: rootRef.current,
        rootMargin: horizontal ? `0px ${amount}px` : `${amount}px 0px`,
        threshold: 0.0
    }

    const observerCallback = (entries: any, io: any) => {
        const intersects = entries.reduce((acc: any, entry: any) => {
            const pageIndex = parseInt(entry.target.getAttribute("data-page-index"))
            return {
            ...acc,
            [pageIndex]: entry.isIntersecting
            }
        }, {})
    
        setVisibilitiesJA((prev: any) => prev.map((visible: any, index: any) => {
            if (intersects.hasOwnProperty(index)) { return intersects[index]; }
            return visible;
        }))

        setVisibilitiesEN((prev: any) => prev.map((visible: any, index: any) => {
            if (intersects.hasOwnProperty(index)) { return intersects[index]; }
            return visible;
        }))
    }

    useEffect(() => {
         const io = new IntersectionObserver(observerCallback, observerOptions)
         setObserver(io)
         return () => io.disconnect()
    }, [])

    useEffect(() => {
        const io = new IntersectionObserver(observerCallback, observerOptions)
        setObserver(io)
        return () => io.disconnect()
   }, [horizontal, zoom])

    useEffect(() => {
        if (observer) {
          pageRefsJA.forEach((p) => observer.observe(p.current))
          pageRefsEN.forEach((p) => observer.observe(p.current))
        }
    }, [observer, pageRefsJA, pageRefsEN])

    useEffect(() => {
        const elements = document.querySelectorAll("span")
        const mouseEnter = () => setEnableDrag(false)
        const mouseLeave = () => setEnableDrag(true)
        elements.forEach((e) => {
            e.addEventListener("mouseenter", mouseEnter)
            e.addEventListener("mouseleave", mouseLeave)
        })
        return () => {
            elements.forEach((e) => {
                e.removeEventListener("mouseenter", mouseEnter)
                e.removeEventListener("mouseleave", mouseLeave)
            })
        }
    })


    const onLoadSuccessJA = async (pdf: any) => {
        setNumPagesJA(pdf.numPages)
        setNumPagesFlag(pdf.numPages)
        setVisibilitiesJA(Array.from(new Array(pdf.numPages), () => false))

        const pageMap = JSON.parse(localStorage.getItem("pageMap") || "{}")
        const savedPage = pageMap[id]
        console.log(pageMap)
        if (savedPage) setTimeout(() => {
            setNavigateFlag(Number(savedPage))
        }, 1000) 
    }

    const onLoadSuccessEN = async (pdf: any) => {
        setNumPagesEN(pdf.numPages)
        setNumPagesFlag(pdf.numPages)
        setVisibilitiesEN(Array.from(new Array(pdf.numPages), () => false))
    }

    const onRenderSuccessJA = () => {
        setThumbsRenderedJA((prev: number) => prev + 1)
    }

    const onRenderSuccessEN = () => {
        setThumbsRenderedEN((prev: number) => prev + 1)
    }

    const onLoadSuccessThumb = async (pdf: any) => {
        setNumPagesThumb(pdf.numPages)
    }

    const generateThumbnails = () => {
        if (mobile) return null
        const thumbsToRenderJA = Math.min(thumbsRenderedJA + 1, numPagesJA)
        const thumbsToRenderEN = Math.min(thumbsRenderedEN + 1, numPagesEN)
        return (
            <>
            <Document className={`pdf-thumbnail-container ${!showThumbnails || !showEn ? horizontal ? "thumbnail-hidden-horizontal" : "thumbnail-hidden" : ""} ${horizontal ? "thumbnail-horizontal" : ""}`} file={enPDF} noData="" loading="">
                {Array.from(new Array(thumbsToRenderEN), (el, index) => {
                    const rendering = thumbsToRenderEN === index + 1
                    const lastThumb = numPagesThumb === index + 1
                    const renderNextThumb = rendering && !lastThumb
                    return (
                      <Page className={`pdf-thumbnail ${page === index + 1 ? "selected" : ""}`} width={100} key={`thumbEN_${index + 1}`} onRenderSuccess={() => renderNextThumb ? onRenderSuccessEN() : null} pageNumber={index + 1} loading="" noData="" renderAnnotationLayer={false} renderTextLayer={false} onClick={() => setNavigateFlag(index + 1)}/>
                    )
                })}
            </Document>
            <Document className={`pdf-thumbnail-container ${!showThumbnails || showEn ? horizontal ? "thumbnail-hidden-horizontal" : "thumbnail-hidden" : ""} ${horizontal ? "thumbnail-horizontal" : ""}`} file={jaPDF} noData="" loading="">
                {Array.from(new Array(thumbsToRenderJA), (el, index) => {
                    const rendering = thumbsToRenderJA === index + 1
                    const lastThumb = numPagesThumb === index + 1
                    const renderNextThumb = rendering && !lastThumb
                    return (
                      <Page className={`pdf-thumbnail ${page === index + 1 ? "selected" : ""}`} width={100} key={`thumbJA_${index + 1}`} onRenderSuccess={() => renderNextThumb ? onRenderSuccessJA() : null} pageNumber={index + 1} loading="" noData="" renderAnnotationLayer={false} renderTextLayer={false} onClick={() => setNavigateFlag(index + 1)}/>
                    )
                })}
            </Document>
            </>
        )
    }

    useEffect(() => {
        const scrollElement = document.querySelector(".pdf-renderer")
        const scrollHandler = () => {
            if (showThumbnails && horizontal) {
                document.querySelectorAll(".pdf-thumbnail-container").forEach((e: any) => {
                    e.style.left = `${scrollElement?.scrollLeft || 0}px`
                })
            } else {
                document.querySelectorAll(".pdf-thumbnail-container").forEach((e: any) => {
                    e.style.left = `0px`
                })
            }
        }
        if (showThumbnails && horizontal) {
            const thumbnailHeight = Array.from(document.querySelectorAll(".pdf-thumbnail-container")).reduce((p, c) => p.clientHeight > c.clientHeight ? p : c)?.clientHeight
            console.log(thumbnailHeight)
            if (!thumbnailHeight) return 
            document.querySelectorAll(".pdf-document").forEach((e: any) => {
                e.style.marginTop = `${thumbnailHeight}px`
            })
        } else {
            document.querySelectorAll(".pdf-document").forEach((e: any) => {
                e.style.marginTop = `0px`
            })
        }
        scrollHandler()
        scrollElement?.addEventListener("scroll", scrollHandler)
        return () => {
            scrollElement?.removeEventListener("scroll", scrollHandler)
        }
    }, [showThumbnails, horizontal])

    useEffect(() => {
        const value = horizontal ? document.querySelector(".pdf-thumbnail")?.clientWidth : document.querySelector(".pdf-thumbnail")?.clientHeight 
        if (!value) return
        document.querySelectorAll(".pdf-thumbnail-container").forEach((e: any) => {
            if (horizontal) {
                if (page > 6 && page < numPagesFlag - 6) {
                    e.scrollLeft = -(Math.round(((page - 1) * (value + 13))) - ((value + 13) * 5))
                }
            } else {
                if (page > 2 && page < numPagesFlag - 2) {
                    e.scrollTop = (Math.round(((page - 1) * (value + 13)))) - ((value + 13) * 2)
                }
            }
        })
    }, [page, horizontal])

    const getWidth = () => {
        if (mobile) return 400
        if (horizontal) {
            return 1000
        } else {
            return 1200
        }
    }

    return (
        <div className={`pdf-renderer drag ${horizontal ? "pdf-renderer-horizontal" : ""}`} ref={rootRef} style={{maxHeight: horizontal ? 773 : 1600}}>
            {generateThumbnails()}
            <Document renderMode="svg" className={`pdf-document ${!showEn ? "hidden" : ""} ${horizontal ? "horizontal" : ""}`} file={enPDF} onLoadSuccess={onLoadSuccessEN} noData="" loading="">
                {visibilitiesEN.map((visible: boolean, index: number) => (
                    <PDFPage id={id} className="pdf-page" ref={pageRefsEN[index]} key={`pageEN_${index + 1}`} pageIndex={index} visible={visible} width={getWidth()} scale={getScale()}/>
                ))}
            </Document>
            <Document renderMode="svg" className={`pdf-document ${showEn ? "hidden" : ""} ${horizontal ? "horizontal" : ""}`} file={jaPDF} onLoadSuccess={onLoadSuccessJA} noData="" loading="">
                {visibilitiesJA.map((visible: boolean, index: number) => (
                    <PDFPage id={id} className="pdf-page" ref={pageRefsJA[index]} key={`pageJA_${index + 1}`} pageIndex={index} visible={visible} width={getWidth()} scale={getScale()}/>
                ))}
            </Document>
        </div>
    )
}

export default PDFRenderer