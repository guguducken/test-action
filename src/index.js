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

    const { data: { jobs } } = await oc.rest.actions.listJobsForWorkflowRun(
        {
            ...github.context.repo,
            run_id: github.context.runId
        }
    )
    for (const job of jobs) {
        core.info(job.name);
    }

}

run();