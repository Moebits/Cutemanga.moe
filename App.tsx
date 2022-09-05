import React, {useEffect, useState, useContext, useReducer} from "react"
import {Switch, Route, Redirect, useHistory, useLocation} from "react-router-dom"
import Context, {EnableDragContext} from "./Context"
import axios from "axios"
import functions from "./structures/Functions"
import HomePage from "./pages/HomePage"
import MangaInfoPage from "./pages/MangaInfoPage"
import MangaPage from "./pages/MangaPage"
import AboutPage from "./pages/AboutPage"
import TermsPage from "./pages/TermsPage"
import $404Page from "./pages/404Page"
import "./index.less"

require.context("./assets/icons", true)

const App: React.FunctionComponent = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const [loaded, setLoaded] = useState(false)
    const [enableDrag, setEnableDrag] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true)
        }, 100)
    }, [])

    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        setTimeout(() => {
            functions.dragScroll(enableDrag)
        }, 100)
    }, [enableDrag, history])

    return (
        <div className={`app ${!loaded ? "stop-transitions" : ""}`}>
            <EnableDragContext.Provider value={{enableDrag, setEnableDrag}}>
                <Context>
                    <Switch>
                        <Route exact path={["/", "/home", "/manga"]}><HomePage/></Route>
                        <Route exact path="/manga/:id" render={(props) => <MangaInfoPage {...props}/>}></Route>
                        <Route exact path="/manga/:id/:num" render={(props) => <MangaPage {...props}/>}></Route>
                        <Route exact path="/about"><AboutPage/></Route>
                        <Route exact path={["/tos", "/terms", "/privacy"]}><TermsPage/></Route>
                        <Route path="*"><$404Page/></Route>
                    </Switch>
                </Context>
            </EnableDragContext.Provider>
        </div>
    )
}

export default App