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
                    core.info(e.pull_request.url);
                } else {
                    getPRTime(e);
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

async function getPRTime(issue) {
    let query = `query($repo:String!, $repo_owner: String!, $number_iss: Int!, $First: Int, $Skip: Int){
  repository(name: $repo, owner: $repo_owner) {
    issue(number: $number_iss) {
      id
      timelineItems(first: $First, skip: $Skip) {
        updatedAt
        edges {
          node {
            ... on CrossReferencedEvent {
              id
              referencedAt
              source {
                ... on PullRequest {
                  id
                  updatedAt
                  title
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
}`;
    let { data: ans } = await oc.graphql(query, {
        "repo": repo.repo,
        "repo_owner": repo.owner,
        "number_iss": issue.number,
        "First": 100,
        "Skip": 0
    });
    core.info(ans);
    let ans_issue = JSON.parse(ans).repository.issue;
    let edges = ans.repository.issue.timelineItems.edges;
    for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        if (e.node === {} || e.node.source === {}) {
            core.info("skip " + i);
        } else {
            core.info(e.node.source.title);
        }
    }
}

run()