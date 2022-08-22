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

    const { data: comments } = await oc.rest.issues.listComments({
        ...github.context.repo,
        issue_number: prNum
    })

    let comment = comments[comments.length - 1];
    await oc.rest.issues.updateComment(
        {
            ...github.context.repo,
            comment_id: comment.id,
            body: ">> " + comment.body + "You do not have permossion!"
        }
    )
}

run();