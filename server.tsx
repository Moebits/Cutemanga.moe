import path from "path"
import cors from "cors"
import mime from "mime"
import fs from "fs"
import express from "express"
import webpack from "webpack"
import middleware from "webpack-dev-middleware"
import hot from "webpack-hot-middleware"
import config from "./webpack.config"
import dotenv from "dotenv"
import React from "react"
import App from "./App"
import {renderToString} from "react-dom/server"
import {StaticRouter as Router} from "react-router-dom"
const __dirname = path.resolve()

dotenv.config()
const app = express()
let compiler = webpack(config as any)
app.use(express.urlencoded({extended: true, limit: "1gb", parameterLimit: 50000}))
app.use(express.json({limit: "1gb"}))
app.use(cors({credentials: true, origin: true}))
app.disable("x-powered-by")
app.set("trust proxy", true)

if (process.env.TESTING === "yes") {
  app.use(middleware(compiler, {
    index: false,
    serverSideRender: false,
    writeToDisk: false,
  }))
  app.use(hot(compiler))
}

app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, "./dist"), {index: false}))
app.use("/assets", express.static(path.join(__dirname, "./assets")))

app.get("/*", function(req, res) {
    if (!req.hostname.includes("cutemanga") && !req.hostname.includes("localhost") && !req.hostname.includes("192.168.68")) {
      res.redirect(301, `https://cutemanga.moe${req.path}`)
    }
    res.setHeader("Content-Type", mime.getType(req.path) ?? "")
    res.header("Access-Control-Allow-Origin", "*")
    const document = fs.readFileSync(path.join(__dirname, "./dist/index.html"), {encoding: "utf-8"})
    const html = renderToString(<Router location={req.url}><App/></Router>)
    res.status(200).send(document?.replace(`<div id="root"></div>`, `<div id="root">${html}</div>`))
})

const run = async () => {
  app.listen(process.env.PORT || 8080, () => console.log("Started the website server!"))
}

run()