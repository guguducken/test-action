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
    const { data: { workflows } } = await oc.rest.actions.listRepoWorkflows(
        {
            owner: "matrixorigin",
            repo: "matrixone"
        }
    )
    core.info(JSON.stringify(workflows));

}

run();