# Publishing AgentLint on GitHub

Run the release checks first:

```bash
npm ci
npm run test:all
npm run release:check
npm run release:bundle
```

Create an empty public `agentlint` repository, then either add the local repository with GitHub Desktop or run:

```bash
git init
git add .
git commit -m "feat: release AgentLint v0.4.0"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/agentlint.git
git push -u origin main
```

Create a `v0.4.0` GitHub Release and upload the contents of `release/`. After validation, point the stable `v0` Action tag at the release commit.

Official documentation:

- https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
