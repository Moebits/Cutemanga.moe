import React, {useContext, useEffect} from "react"
import {PageContext, HorizontalContext} from "../Context"
import {Page} from "react-pdf"
import {useInView} from "react-intersection-observer"

const WrappedPage = ({pageNumber, width, loading, scale, id}) => {
    const {page, setPage} = useContext(PageContext)
    const {horizontal, setHorizontal} = useContext(HorizontalContext)
    const {ref, inView} = useInView()

    useEffect(() => {
        if (inView) {
            if (horizontal) {
                if (page !== pageNumber - 1) {
                    setPage(pageNumber - 1)
                    const pageMap = JSON.parse(localStorage.getItem("pageMap") || "{}")
                    pageMap[id] = pageNumber - 1
                    localStorage.setItem("pageMap", JSON.stringify(pageMap))
                }
            } else {
                if (page !== pageNumber) {
                    setPage(pageNumber)
                    const pageMap = JSON.parse(localStorage.getItem("pageMap") || "{}")
                    pageMap[id] = pageNumber
                    localStorage.setItem("pageMap", JSON.stringify(pageMap))
                }
            }
        }
    }, [inView])

    return (
        <div ref={ref}>
            <Page pageNumber={pageNumber} width={width} loading={loading} scale={scale} renderAnnotationLayer={false}/>
        </div>
    )
}

export default WrappedPage