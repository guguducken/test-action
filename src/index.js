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
            break;
        } else {
            for (let i = 0; i < iss.length; i++) {
                const e = iss[i];
                if (e.pull_request !== undefined) {
                    // core.info("This is PR, " + e.title + " " + e.created_at);
                    // core.info(e.pull_request.url);
                } else {
                    core.info(e.title);
                    await getPRTime(e);
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

async function getLastPRUpdateTime(issue) {
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
    let hasNext = true;
    let start = 0;
    let per_page = 20;
    let lastUpdate = 0;
    let lastPR;

    while (hasNext) {
        let { repository } = await oc.graphql(query, {
            "repo": repo.repo,
            "repo_owner": repo.owner,
            "number_iss": issue.number,
            "First": per_page,
            "Skip": start
        });
        hasNext = repository.issue.timelineItems.pageInfo.hasNextPage;
        start += per_page;
        let edges = repository.issue.timelineItems.edges;
        for (let i = 0; i < edges.length; i++) {
            const e = edges[i];
            if (e.node !== undefined || e.node.source !== undefined || Object.keys(e.node).length != 0 || Object.keys(e.node.source).length != 0) {
                t = Date.parse(e.node.source.updatedAt);
                if (t > lastUpdate) {
                    lastUpdate = t;
                    lastPR = e.node.source;
                }
            }
        }
    }
    core.info(JSON.stringify(lastPR));
}

run()