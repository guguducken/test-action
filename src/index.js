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

    let t = "";
    let package_go = new Array();
    for (let i = 0; i < test_name.length; i++) {
        const e = test_name[i];
        if (e == " ") {
            if (t.length != 0) {
                package_go.push(t);
                t = "";
            }
        } else {
            t += e;
        }
    }
    for (const pack of package_go) {
        core.info(pack);
    }


}

run();