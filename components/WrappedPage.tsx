import React, {useContext, useEffect} from "react"
import {PageContext, HorizontalContext} from "../Context"
import {Page} from "react-pdf"
import {useInView} from "react-intersection-observer"

const WrappedPage = ({pageNumber, width, loading, scale}) => {
    const {page, setPage} = useContext(PageContext)
    const {horizontal, setHorizontal} = useContext(HorizontalContext)
    const {ref, inView} = useInView()

    useEffect(() => {
        if (inView) {
            if (horizontal) {
                if (page !== pageNumber - 1) setPage(pageNumber - 1)
            } else {
                if (page !== pageNumber) setPage(pageNumber)
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