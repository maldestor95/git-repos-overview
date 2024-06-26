#!/usr/bin/env ts-node
import dotenv from "dotenv"
import gitStatus, { displayNotAGitRepo, displayNotGitSync, displaytGitSync, gitStatusResultType } from "./lib/gitstatus"
import fs from "fs/promises"
import { PathLike } from "node:fs"

dotenv.config()

const main = async () => {

    const pathToScan = <PathLike>process.env.pathToScan

    let readdir = await fs.readdir(pathToScan, { withFileTypes: true })
    const pathToTest = `${pathToScan}/dorf`
    const gitStatusPromises = readdir
        .filter((dirent_dd) => dirent_dd.isDirectory())
        .map((current_directory) => {
            if (current_directory.isDirectory())
                return gitStatus(`${pathToScan}/${current_directory.name}`)
        })
    const overallGitFolderStatus = <gitStatusResultType[]>await Promise.all(gitStatusPromises).then((results) =>
        results
    )
    displayNotAGitRepo(overallGitFolderStatus)
    displaytGitSync(overallGitFolderStatus)
    displayNotGitSync(overallGitFolderStatus)
}


main()