const core = require('@actions/core');
const github = require('@actions/github');
const http = require('@actions/http-client');

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
            per_page: 100,
            page: 1
        }
    )

    const { data: { head } } = await oc.rest.pulls.get(
        {
            ...github.context.repo,
            pull_number: prNum
        }
    )
    for (const run of workflow_runs) {
        core.info(run.jobs_url);
        core.info(run.head_sha);
        core.info(run.head_sha == head.sha);
    }

}

run();