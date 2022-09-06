import database, {genres} from "../json/database"
import functions from "./Functions"

export default class DatabaseFunctions {
    public static getRecent = () => {
        const recent = database.sort((a, b) => Date.parse(a.added) < Date.parse(b.added) ? 1 : -1)
        return recent.map((m) => ({title: m.title, id: m.id}))
    }

    public static getGenres = () => {
        return genres
    }

    public static getSorted = (query: string, genre: string, sort: string, reverse: boolean) => {
        let mangas = database.slice()
        if (query) mangas = mangas.filter((m) => {
            if (m.title.toLowerCase().includes(query.trim().toLowerCase())) return true 
            return false
        })
        if (genre) mangas = mangas.filter((m) => {
            if (m.genres.includes(genre)) return true
            return false
        })
        if (sort === "alphabetic") {
            mangas = mangas.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sort === "bookmarks") {
            let bookmarkStr = localStorage.getItem("bookmarks")
            if (!bookmarkStr) bookmarkStr = "{}"
            const bookmarks = JSON.parse(bookmarkStr)
            mangas = mangas.filter((m) => {
                if (bookmarks[m.id] === true) return true 
                return false
            })
        } else {
            mangas = mangas.sort((a, b) => Date.parse(a.added) < Date.parse(b.added) ? 1 : -1)
        }
        if (reverse) mangas = mangas.reverse()
        return mangas
    }
}