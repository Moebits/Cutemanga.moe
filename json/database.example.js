export const genres = [""]

const getCover = (id, title) => {
    return `https://example.moe/${id}/covers/${title} 1.jpg`
}

const getVolumes = (id, title, volumeCount) => {
    let volumes = []
    for (let i = 0; i < volumeCount; i++) {
        const volume = i + 1
        volumes.push({
            volumeNumber: volume,
            cover: `https://example.moe/${id}/covers/${title} ${volume}.jpg`,
            japaneseSource: `https://example.moe/${id}/japanese/${title} ${volume}.pdf`,
            englishSource: `https://example.moe/${id}/english/${title} ${volume}.pdf`
        })
    }
    return volumes
}

export default [
        {
            title: "",
            id: "",
            japaneseTitle: "",
            artist: "",
            published: "",
            added: "",
            genres: [""],
            synopsis: "",
            synopsisSource: "",
            website: "",
            cover: getCover("", ""),
            volumeCount: 1,
            volumes: getVolumes("", "", 1)
    }
]