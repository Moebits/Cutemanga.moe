import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import {EnableDragContext, SearchContext, SortContext, SearchFlagContext, GenreContext, ReverseContext, MobileContext} from "../Context"
import functions from "../structures/Functions"
import GridManga from "./GridManga"
import pageLeft from "../assets/icons/pageLeft.png"
import pageRight from "../assets/icons/pageRight.png"
import database from "../json/database"
import dbFunctions from "../structures/DatabaseFunctions"
import "./styles/mangagrid.less"

interface Props {
    hidden?: boolean
}

const MangaGrid: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {search, setSearch} = useContext(SearchContext)
    const {searchFlag, setSearchFlag} = useContext(SearchFlagContext)
    const {genre, setGenre} = useContext(GenreContext)
    const {sort, setSort} = useContext(SortContext)
    const {reverse, setReverse} = useContext(ReverseContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const [mangaList, setMangaList] = useState([]) as any
    const history = useHistory()

    const updateMangaList = () => {
        const list = props.hidden ? dbFunctions.getSortedHidden(search, genre, sort, reverse) : dbFunctions.getSorted(search, genre, sort, reverse)
        setMangaList(list)
    }

    useEffect(() => {
        updateMangaList()
    }, [])

    useEffect(() => {
        if (searchFlag) setSearchFlag(false)
        updateMangaList()
    }, [searchFlag, genre, sort, reverse])

    const generateJSX = () => {
        let jsx = [] as any
        let step = mobile ? 2 : 4
        for (let i = 0; i < mangaList.length; i+=step) {
            let gridImages = [] as any
            for (let j = 0; j < step; j++) {
                const k = i+j
                if (!mangaList[k]) break
                gridImages.push(<GridManga img={mangaList[k].cover} title={mangaList[k].title} id={mangaList[k].id} key={k} refresh={updateMangaList}/>)
            }
            jsx.push(
                <div className="manga-grid-row">
                    {gridImages}
                </div>
            )

        }
        return jsx 
    }

    return (
        <div className="manga-grid">
            <div className="manga-grid-container">
                {generateJSX()}
            </div>
            {/* <div className="manga-grid-page-container">
                <button className="manga-grid-page-button">
                    <span className="manga-grid-page-button-hover">
                        <img className="manga-grid-page-button-img" src={pageLeft}/>
                    </span>
                </button>
                <button className="manga-grid-page-button">
                    <span className="manga-grid-page-button-hover">
                        <span className="manga-grid-page-button-text">1</span>
                    </span>
                </button>
                <button className="manga-grid-page-button">
                    <span className="manga-grid-page-button-hover">
                        <span className="manga-grid-page-button-text">2</span>
                    </span>
                </button>
                <button className="manga-grid-page-button">
                    <span className="manga-grid-page-button-hover">
                        <span className="manga-grid-page-button-text">3</span>
                    </span>
                </button>
                <button className="manga-grid-page-button">
                    <span className="manga-grid-page-button-hover">
                        <span className="manga-grid-page-button-text">...</span>
                    </span>
                </button>
                <button className="manga-grid-page-button">
                    <span className="manga-grid-page-button-hover">
                        <img className="manga-grid-page-button-img" src={pageRight}/>
                    </span>
                </button>
            </div> */}
        </div>
    )
}

export default MangaGrid