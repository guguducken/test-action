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
            ...github.context.repo,
            pull_number: prNum
        }
    );

    core.info(pr.body);

    for (let i = 0; i < pr.body.length; i++) {
        const e = pr.body[i];
        core.info(i + " : " + e);
    }
    core.info("-------------------------------------------------------");

    const index = pr.body.lastIndexOf("## This is test no 2");
    core.info(pr.body.substring(index));
    core.info(index);


}

run();