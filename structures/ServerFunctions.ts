import database, {genres} from "../json/database"
import S3 from "aws-sdk/clients/s3"

const s3 = new S3({region: "us-east-1", credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
}})

export default class ServerFunctions {
    public static uploadFile = async (file: string, content: any) => {
        const upload = await s3.upload({Body: content, Key: file, Bucket: "cutemanga"}).promise()
        return upload.Location
    }

    public static deleteFile = async (file: string) => {
        await s3.deleteObject({Key: file, Bucket: "cutemanga"}).promise()
    }

    public static massDelete = async () => {
        let manga = database.slice()
        console.log(manga.length)
        for (let i = 0; i < manga.length; i++) {
            const id = manga[i].id
            console.log(id)
            const title = manga[i].title
            const coverKey = `${id}/covers/${title} 1.jpg`
            await ServerFunctions.deleteFile(coverKey).catch((e) => console.log(e))
            for (let j = 0; j < manga[i].volumeCount; j++) {
                const volume = j + 1
                const coverKey = `${id}/covers/${title} ${volume}.jpg`
                const japaneseKey = `${id}/japanese/${title} ${volume}.pdf`
                const englishKey = `${id}/english/${title} ${volume}.pdf`
                await ServerFunctions.deleteFile(coverKey).catch((e) => console.log(e))
                await ServerFunctions.deleteFile(englishKey).catch((e) => console.log(e))
                await ServerFunctions.deleteFile(japaneseKey).catch((e) => console.log(e))
            }
            if (manga[i].specialVolumes) {
                for (let j = 0; j < manga[i].specialVolumes?.length!; j++) {
                    const volume = manga[i].specialVolumes?.[j]
                    const coverKey = `${id}/covers/${title} ${volume}.jpg`
                    const japaneseKey = `${id}/japanese/${title} ${volume}.pdf`
                    const englishKey = `${id}/english/${title} ${volume}.pdf`
                    await ServerFunctions.deleteFile(coverKey).catch((e) => console.log(e))
                    await ServerFunctions.deleteFile(englishKey).catch((e) => console.log(e))
                    await ServerFunctions.deleteFile(japaneseKey).catch((e) => console.log(e))   
                }
            }
        }
        console.log("done")
    }
}