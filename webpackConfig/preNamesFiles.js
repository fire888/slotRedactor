const exec = require('child_process').execSync

exports.getPreNamesFiles = function () {
    const hashCommit = JSON.stringify('' + exec("cd .. && git log -1 --pretty=format:%h")).replace(/"/g, "")
    const libHashCommit = JSON.stringify('' + exec("git log -1 --pretty=format:%h")).replace(/"/g, "")
    return `${ hashCommit }_${ libHashCommit }_`
}