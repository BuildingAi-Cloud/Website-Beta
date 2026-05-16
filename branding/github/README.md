# GitHub / repo-public surface

Brand surfaces visible to anyone landing on the repository on
github.com — contributors, prospects, security researchers, recruiters.

For most white-label deployments this surface is **not exposed** —
white-label customers fork to a private repo or run from a vendored
build artefact. This page applies when the repo itself ships under
the customer's brand (rare, usually only Sovereign tier where the
customer takes full source ownership).

## Surfaces

- `README.md` at the repo root
- Repo description + topics on github.com
- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/FUNDING.yml`
- Social preview image (Settings → General → Social preview)
- License file

## Brand surfaces in this repo today

| Where                            | Source                       |
| -------------------------------- | ---------------------------- |
| `CLAUDE.md` brand references     | `CLAUDE.md` (developer-only) |
| `package.json` `description`     | `package.json`               |
| `README.md`                      | not currently in repo        |

## Override checklist (Sovereign-only)

- [ ] `package.json` `name` + `description`
- [ ] Add a `README.md` at the root with the customer's framing
      (BuildingSync intentionally has no public README to keep the
      product story on the marketing site)
- [ ] Replace any `.github/` issue / PR templates that reference
      BuildingSync internal processes
- [ ] Update GitHub repo description + topics in repo Settings
- [ ] Upload customer social preview image (1280×640 recommended)
- [ ] Confirm `LICENSE` / `LICENSE.md` matches the customer's terms

## Note on GitHub Pages

This is a Next.js + Vercel deployment, **not** a GitHub Pages site.
The `gh-pages` branch (if any) is unused. Don't enable GitHub Pages
in repo Settings — it would publish stale source files at
`<owner>.github.io/<repo>` and confuse search engines.

If a customer specifically wants a static documentation site, build
it separately (e.g. with Docusaurus or VitePress) and host it under
a subdomain.

## Test checklist

- [ ] Repo home page shows customer name + description
- [ ] Issue templates use customer-appropriate language
- [ ] Social preview renders correctly when shared on Slack / X /
      LinkedIn
- [ ] `package.json` doesn't leak BuildingSync internal references
