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

    const workflow = github.context.workflow;
    const action = github.context.action;
    const job = github.context.job;

    const { data: { workflow_runs } } = await oc.rest.actions.listWorkflowRunsForRepo(
        {
            ...github.context.repo,
        }
    )
    for (const run of workflow_runs) {
        for (const pulls of run.pull_requests) {
            if (pulls.number == github.context.payload.pull_request.number) {
                core.info(run.name);
                break;
            }
        }
    }

}

run();