const core = require('@actions/core');
const github = require('@actions/github');

const accseeToken = core.getInput("action-token");

async function run() {
    let oc = github.getOctokit(accseeToken);

    const repo = github.context.repo;

    const prNum = github.context.payload?.pull_request.number;

    if (prNum === undefined) {
        return;
    }

    const { data: comments } = await oc.rest.issues.get({
        ...github.context.repo,
        issue_number: prNum
    })

    core.info(JSON.stringify(comments))

    // for (const comment of comments) {
    //     core.info(comment.body);
    // }
}

run();