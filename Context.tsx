import React, {useState} from "react"

export const EnableDragContext = React.createContext<any>(null)
export const PageContext = React.createContext<any>(null)
export const NumPagesFlagContext = React.createContext<any>(null)
export const ZoomContext = React.createContext<any>(null)
export const ShowEnContext = React.createContext<any>(null)
export const HorizontalContext = React.createContext<any>(null)
export const ShowThumbnailsContext = React.createContext<any>(null)
export const NavigateFlagContext = React.createContext<any>(null)
export const DonationFlagContext = React.createContext<any>(null)
export const SidebarSortContext = React.createContext<any>(null)
export const SortContext = React.createContext<any>(null)
export const GenreContext = React.createContext<any>(null)
export const SearchContext = React.createContext<any>(null)
export const SearchFlagContext = React.createContext<any>(null)
export const ReverseContext = React.createContext<any>(null)
export const SiteHueContext = React.createContext<any>(null)
export const SiteSaturationContext = React.createContext<any>(null)
export const SiteLightnessContext = React.createContext<any>(null)
export const InvertContext = React.createContext<any>(null)
export const MobileContext = React.createContext<any>(null)

const Context: React.FunctionComponent = (props) => {
    const [page, setPage] = useState("1")
    const [zoom, setZoom] = useState("100%")
    const [numPagesFlag, setNumPagesFlag] = useState(1)
    const [showEn, setShowEn] = useState(false)
    const [horizontal, setHorizontal] = useState(false)
    const [showThumbnails, setShowThumbnails] = useState(false)
    const [navigateFlag, setNavigateFlag] = useState(null)
    const [donationFlag, setDonationFlag] = useState(null)
    const [sort, setSort] = useState("date")
    const [sidebarSort, setSidebarSort] = useState("recent")
    const [genre, setGenre] = useState("")
    const [search, setSearch] = useState("")
    const [searchFlag, setSearchFlag] = useState(false)
    const [reverse, setReverse] = useState(false)
    const [siteHue, setSiteHue] = useState(180)
    const [siteSaturation, setSiteSaturation] = useState(100)
    const [siteLightness, setSiteLightness] = useState(50)
    const [invert, setInvert] = useState(false)
    return (
        <>  
            <InvertContext.Provider value={{invert, setInvert}}>
            <SiteLightnessContext.Provider value={{siteLightness, setSiteLightness}}>
            <SiteSaturationContext.Provider value={{siteSaturation, setSiteSaturation}}>
            <SiteHueContext.Provider value={{siteHue, setSiteHue}}>
            <ReverseContext.Provider value={{reverse, setReverse}}>
            <GenreContext.Provider value={{genre, setGenre}}>
            <SearchFlagContext.Provider value={{searchFlag, setSearchFlag}}>
            <SearchContext.Provider value={{search, setSearch}}>
            <SidebarSortContext.Provider value={{sidebarSort, setSidebarSort}}>
            <SortContext.Provider value={{sort, setSort}}>
            <DonationFlagContext.Provider value={{donationFlag, setDonationFlag}}>
            <NavigateFlagContext.Provider value={{navigateFlag, setNavigateFlag}}>
            <ShowThumbnailsContext.Provider value={{showThumbnails, setShowThumbnails}}>
            <HorizontalContext.Provider value={{horizontal, setHorizontal}}>
            <ShowEnContext.Provider value={{showEn, setShowEn}}>
            <NumPagesFlagContext.Provider value={{numPagesFlag, setNumPagesFlag}}>
            <ZoomContext.Provider value={{zoom, setZoom}}>
            <PageContext.Provider value={{page, setPage}}>
                {props.children}
            </PageContext.Provider>
            </ZoomContext.Provider>
            </NumPagesFlagContext.Provider>
            </ShowEnContext.Provider>
            </HorizontalContext.Provider>
            </ShowThumbnailsContext.Provider>
            </NavigateFlagContext.Provider>
            </DonationFlagContext.Provider>
            </SortContext.Provider>
            </SidebarSortContext.Provider>
            </SearchContext.Provider>
            </SearchFlagContext.Provider>
            </GenreContext.Provider>
            </ReverseContext.Provider>
            </SiteHueContext.Provider>
            </SiteSaturationContext.Provider>
            </SiteLightnessContext.Provider>
            </InvertContext.Provider>
        </>
    )
}

export default Context