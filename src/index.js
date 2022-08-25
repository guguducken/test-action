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

    const { data: workflows_all } = await oc.rest.actions.listRepoWorkflows(
        {
            ...github.context.repo
        }
    )

    for (const workflow of workflows_all.workflows) {
        if (workflow.state == "active") {
            core.info("Start finding workflow, name is: " + workflow.name);
            let num_page = 1;
            while (true) {
                const { data: { total_count: total_count_1, workflow_runs: workflow_runs_1 } } = await oc.rest.actions.listWorkflowRuns(
                    {
                        ...github.context.repo,
                        workflow_id: workflow.id,
                        per_page: 100,
                        page: num_page,
                        event: "pull_request"
                    }
                );
                for (const workflow_run of workflow_runs_1) {
                    core.info(workflow_run.event);
                }
                core.info("----------------------------------------------");
                const { data: { total_count: total_count_2, workflow_runs: workflow_runs_2 } } = await oc.rest.actions.listWorkflowRuns(
                    {
                        ...github.context.repo,
                        workflow_id: workflow.id,
                        per_page: 100,
                        page: num_page,
                        event: "pull_request_target"
                    }
                );
                for (const workflow_run of workflow_runs_2) {
                    core.info(workflow_run.event);
                }
                core.info("----------------------------------------------");
            }
        }
    }
}

run();