import childprocess from "node:child_process"
import util from 'util'
const execPromise = util.promisify(childprocess.exec);



type gitStatusType = {
    path: string
    status: string
}
const gitFecthUno = 'git fetch && git status -uno'
const gitStatusCmd = 'git status'
const git_command = gitStatusCmd
const notARepo = `not a git repository`
export default async (path: string) => {
    const { stdout, stderr } = <Record<string, string>>await execPromise(git_command, { cwd: path }).catch(err => err)
    if (stderr) {
        if (stderr.includes(notARepo))
            return { path: path, status: "not a git repository" }
        return { path: path, status: `${path}=> ${stderr}` }
        // console.log(`stderr: ${path}=> ${stderr}`)
    }

    return {
        path: path, status: getStatus(stdout, path)
    }
}

export { gitStatusType, }

const getStatus = (stdout: string, path: string) => {
    const Changes_not_staged = `Changes not staged for commit`
    const upTodateStatus = `branch is up to date`
    const branch_behind = `branch is behind`
    const branch_ahead = `branch is ahead `
    const untracked_files = `untracked files`
    const HEAD_detached = `HEAD detached`


    if (stdout.includes(Changes_not_staged)) return Changes_not_staged
    if (stdout.includes(upTodateStatus)) return upTodateStatus
    if (stdout.includes(notARepo)) return notARepo
    if (stdout.includes(branch_behind)) return branch_behind
    if (stdout.includes(branch_ahead)) return branch_ahead
    if (stdout.includes(untracked_files)) return untracked_files
    if (stdout.includes(HEAD_detached)) return HEAD_detached
    return `${path}==>${stdout}`
}