const core = require('@actions/core');
const github = require('@actions/github');
const http = require('@actions/http-client');

const accseeToken = core.getInput("action-token");

const test_name = core.getInput("name-test");

async function run() {
    let oc = github.getOctokit(accseeToken);

    const repo = github.context.repo;

    const prNum = github.context.payload?.pull_request.number;

    if (prNum === undefined) {
        return;
    }

    const { data: pr } = await oc.rest.pulls.get(
        {
            repo: "matrixone",
            owner: "matrixorigin",
            pull_number: 4742
        }
    );

    core.info(pr.body);
    core.info(JSON.stringify(pr.body));

    for (let i = 0; i < pr.body.length; i++) {
        const e = pr.body[i];
        core.info(i + " : " + e);
    }
    core.info("-------------------------------------------------------");

    const index = pr.body.lastIndexOf("## What this PR does / why we need it:");
    core.info(pr.body.substring(index));
    core.info(index);


}

run();