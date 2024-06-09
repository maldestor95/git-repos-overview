import childprocess from "node:child_process"
import util from 'util'
const execPromise = util.promisify(childprocess.exec);

type gitStatusType = {
    path: string
    status: string
}
type gitStatusResultType = Awaited<ReturnType<typeof gitStatus>>

const gitFecthUno = 'git fetch && git status -uno'
const gitStatusCmd = 'git status'
const git_command = gitStatusCmd

const notARepo = `not a git repository`

/** 
 * @description
 * return the Git Status of a folder
 * @param 
 * path
 * @returns
 * Object with {{key:initial_path, status:git_execution_results}}
 * 
 * the git execution results are static string reflecting:
 * upTodateStatus
 * branch_behind
 * branch_ahead
 * untracked_files
 * HEAD_detached
 * 
 */
const gitStatus = async (path: string) => {
    const { stdout, stderr } = <Record<string, string>>await execPromise(git_command, { cwd: path }).catch(err => err)
    if (stderr) {
        if (stderr.includes(notARepo))
            return { path: path, status: "not a git repository" }
        return { path: path, status: `${path}=> ${stderr}` }
    }
    return {
        path: path, status: extractStatusFromGitResponse(stdout, path)
    }
}
export default gitStatus
export { gitStatusType, displayNotAGitRepo, displaytGitSync, displayNotGitSync, gitStatusResultType }

const extractStatusFromGitResponse = (stdout: string, path: string) => {
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

const displayNotAGitRepo = (gitFolderStatus: gitStatusResultType[]) => {
    const noRepo = gitFolderStatus.filter(ff => ff.status == 'not a git repository')
    console.error(`\n Folders with no repos`)
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