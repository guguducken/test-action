const core = require('@actions/core');
const github = require('@actions/github');
const http = require('@actions/http-client');

const accseeToken = core.getInput("action-token");

const test_name = core.getInput("name-test");
let oc = github.getOctokit(accseeToken);
const repo = github.context.repo;

async function run() {

    for (let i = 1; i < 3; i++) {
        const iss = await getIssues(i, 100)
        if (iss === undefined) {
            core.info("finished");
        } else {
            for (let i = 0; i < iss.length; i++) {
                const e = iss[i];
                if (e.pull_request !== undefined) {
                    core.info("This is PR, " + e.title + " " + e.created_at);
                } else {
                    core.info(e.title + " " + e.created_at + " " + e.updated_at);
                }
            }
        }
    }

}

async function getIssues(now, num_page) {
    const { data: iss } = await oc.rest.issues.listForRepo(
        {
            ...repo,
            state: "open",
            sort: "created",
            direction: "asc",
            per_page: num_page,
            page: now
        }
    )
    if (iss.length == 0) {
        return undefined
    }
    return iss
}

run()