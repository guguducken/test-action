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
    const { data: { artifacts } } = await oc.rest.actions.listArtifactsForRepo(
        {
            owner: "matrixorigin",
            repo: "matrixone"
        }
    )
    for (const work of artifacts) {
        core.info(work.name);
    }

}

run();