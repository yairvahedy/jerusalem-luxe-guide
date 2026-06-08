import { ReplitConnectors } from "@replit/connectors-sdk";
import { execSync } from "child_process";
import { readFileSync } from "fs";

const connectors = new ReplitConnectors();
const owner = "yairvahedy";
const repo = "jerusalem-luxe-guide";
const branch = "main";
const cwd = "/home/runner/workspace";

// Create a proxy fetch that auto-authenticates
const proxyFetch = connectors.createProxyFetch("github");

async function proxy(method, path, body) {
  const res = await proxyFetch(`https://api.github.com${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} => ${res.status}: ${text}`);
  }
  return res.json();
}

// Get files
function getFiles() {
  return execSync("git ls-files", { cwd, encoding: "utf8" }).trim().split("\n").filter(Boolean);
}

async function main() {
  const files = getFiles();
  console.log("Files:", files.length);

  // Get current remote state
  const remoteRef = await proxy("GET", `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  const remoteCommit = remoteRef.object.sha;
  console.log("Remote commit:", remoteCommit);

  // Get current tree
  const commit = await proxy("GET", `/repos/${owner}/${repo}/git/commits/${remoteCommit}`);
  const currentTree = commit.tree.sha;
  console.log("Current tree:", currentTree);

  // Create blobs for each file
  const treeEntries = [];
  let batch = [];
  let batchSize = 0;

  for (const filePath of files) {
    const content = readFileSync(`${cwd}/${filePath}`, { encoding: "utf8" });
    const base64 = Buffer.from(content, "utf8").toString("base64");

    // Create blob
    const blob = await proxy("POST", `/repos/${owner}/${repo}/git/blobs`, {
      content,
      encoding: "utf-8",
    });

    treeEntries.push({
      path: filePath,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });

    process.stdout.write(".");
  }
  console.log("");

  // Create new tree
  const newTree = await proxy("POST", `/repos/${owner}/${repo}/git/trees`, {
    base_tree: currentTree,
    tree: treeEntries,
  });
  console.log("New tree:", newTree.sha);

  // Get commit message
  const message = execSync("git log -1 --format=%B", { cwd, encoding: "utf8" }).trim() || "Update";
  const parent = execSync("git rev-parse HEAD~1", { cwd, encoding: "utf8" }).trim();

  // Create commit
  const newCommit = await proxy("POST", `/repos/${owner}/${repo}/git/commits`, {
    message,
    tree: newTree.sha,
    parents: [parent === remoteCommit ? remoteCommit : parent],
  });
  console.log("New commit:", newCommit.sha);

  // Update ref
  await proxy("PATCH", `/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    sha: newCommit.sha,
    force: true,
  });
  console.log("✅ Pushed to", branch);
}

main().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
