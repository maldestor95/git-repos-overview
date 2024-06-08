#!/usr/bin/env ts-node
import dotenv from "dotenv"
import gitStatus, { gitStatusType } from "./lib/gitstatus"
import fs from "fs/promises"
import { PathLike } from "node:fs"

dotenv.config()
type gitStatusResultType = Awaited<ReturnType<typeof gitStatus>>

const main = async () => {

    const pathToScan = <PathLike>process.env.pathToScan

    let readdir = await fs.readdir(pathToScan, { withFileTypes: true })
    const pathToTest = `${pathToScan}/dorf`
    const gitStatusPromises = readdir
        .filter((dirent_dd) => dirent_dd.isDirectory())
        .map((dd) => {
            if (dd.isDirectory())
                return gitStatus(`${pathToScan}/${dd.name}`)
        })
    const overallGitFolderStatus = <gitStatusResultType[]>await Promise.all(gitStatusPromises).then((results) =>
        results
    )
    // console.log(overallGitFolderStatus)
    displayNotAGitRepo(overallGitFolderStatus)
    displaytGitSync(overallGitFolderStatus)
    displayNotGitSync(overallGitFolderStatus)
}
const displayNotAGitRepo = (gitFolderStatus: gitStatusResultType[]) => {
    const noRepo = gitFolderStatus.filter(ff => ff.status == 'not a git repository')
    console.log(`\n Folders with not repos`)
    noRepo.forEach(ff => console.log(ff.path))
}
const displaytGitSync = (gitFolderStatus: gitStatusResultType[]) => {
    const noRepo = gitFolderStatus.filter(ff => ff.status.includes('branch is up to date'))
    console.log(`\n Branch is up to date`)
    noRepo.forEach(ff => console.log(ff.path))
}
const displayNotGitSync = (gitFolderStatus: gitStatusResultType[]) => {
    const noRepo = gitFolderStatus.filter(ff => (!ff.status.includes('not a git repository') && !ff.status.includes('branch is up to date')))
    console.log(`\n Folders with  repos not syncronized`)
    noRepo.forEach(ff => console.log(ff.path))
}

main()