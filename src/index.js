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

    const { data: pr } = await oc.rest.pulls.get(
        {
            ...repo,
            pull_number: prNum,
        }
    )
    const { head } = pr;
    core.info(head.repo.full_name);
    core.info(head.ref);
}

run();