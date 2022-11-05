const core = require('@actions/core');
const github = require('@actions/github');
const http = require('@actions/http-client');

const accseeToken = core.getInput("action-token");

const test_name = core.getInput("name-test");
let oc = github.getOctokit(accseeToken);
const repo = github.context.repo;

async function run() {


    // const prNum = github.context.payload?.pull_request.number;

    // if (prNum === undefined) {
    //     return;
    // }

    // const { data: pr } = await oc.rest.pulls.get(
    //     {
    //         repo: "matrixone",
    //         owner: "matrixorigin",
    //         pull_number: 4742
    //     }
    // );

    // core.info(pr.body);
    // core.info(JSON.stringify(pr.body));
    // core.info("-------------------------------------------------------");

    // const index = pr.body.lastIndexOf("## What this PR does / why we need it:");
    // core.info(pr.body.substring(index));
    // core.info(index);

    // core.info(pr.title);
    // core.info(pr.title.length);
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
                    core.info(e.title + " " + e.created_at);
                }
            }
        }
    }
    let da = new Date().getTime();
    let past = Date.parse("1970-02-01T00:00:00Z");
    let duration = da - past
    let millisecond = duration % 1000
    duration /= 1000

    let second = duration % 60
    duration /= 60

    let minute = duration % 60
    duration /= 60

    let hour = duration % 24
    duration /= 24

    let day = duration

    core.info(day + " " + hour + " " + minute + " " + second + " " + millisecond)

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