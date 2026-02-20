import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function POST(req: Request) {
    try {
        const { tenantId, filePath, fileContent, commitMessage } = await req.json();

        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            return NextResponse.json({ error: "GitHub credentials missing" }, { status: 500 });
        }

        // 1. Get the current main branch reference to branch off
        const { data: refData } = await octokit.git.getRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: "heads/main",
        });

        const baseSha = refData.object.sha;
        const branchName = `ai-update-${tenantId}-${Date.now()}`;

        // 2. Create a new branch for the AI change
        await octokit.git.createRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: `refs/heads/${branchName}`,
            sha: baseSha,
        });

        // 3. Get the Blob SHA (or create one) for the base file if it exists
        let fileSha;
        try {
            const { data: fileData } = await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: filePath,
                ref: branchName,
            });
            // @ts-ignore
            fileSha = fileData.sha;
        } catch (e) {
            // File doesn't exist yet, which is fine
        }

        // 4. Create/Update the file in the new branch
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: filePath,
            message: commitMessage || `AI Update from Generative UI for tenant: ${tenantId}`,
            content: Buffer.from(fileContent).toString("base64"),
            branch: branchName,
            sha: fileSha,
        });

        // Note: Vercel automatically deploys the branch to a Preview URL. 
        // We return the branch name so the frontend can poll Vercel API for the deployment URL.

        return NextResponse.json({
            success: true,
            branch: branchName,
            message: "Branch created and change committed to GitHub."
        });

    } catch (error) {
        console.error("GitHub API Error:", error);
        return NextResponse.json({ error: "Failed to create commit" }, { status: 500 });
    }
}
