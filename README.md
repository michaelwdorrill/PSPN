# PSPN

Pokémon Sports Programming Network covers the Indigo Football League and the road to the Indigo Bowl.

## Build and preview

Node 22 or newer; no packages to install.

```sh
node scripts/build.mjs
python -m http.server 8080 --directory public
```

Pushes to main build, validate and deploy the public directory to GitHub Pages. The site also works under a repository path such as /PSPN/. Every article has a permanent HTML address.

## The lasting newsroom record

- content/canon/world.json: league names, coaches, the six writers, public biographies, private writing directions and favorite/rival preferences.
- content/canon/characters.json: stable player IDs, randomly assigned Pokémon natures, voices and universities. Assign once; preserve through trades, nicknames and evolution.
- content/canon/universities.json: 136 programs in ten regional conferences, frozen against 2026 football membership. Real-school mappings are authoring reference only.
- content/canon/editorial-history.json: published power rankings, themes and draft rotation.
- content/articles/: authored prose and structured rankings, previews and draft boards.
- content/predictions/: the five writers’ score picks, retained unchanged after publication.
- content/editions/: complete frozen reader-facing editions, including genuine game logs, box scores, standings and article content.
- content/latest.json: which edition opens on the homepage.
- web/: site code and immutable, locally hosted artwork, game emblems and Pokémon icons.

These content files are the publication’s durable source records. They are kept in the repository, outside the deployed reader-facing directory. GitHub Pages is static hosting; there is no server process, API key or database to maintain. The repository is public, so authoring canon is visible to anyone browsing the code even though editorial mechanics are absent from the site itself.

## Publishing another week

1. Pull this repository before writing so its canon and archives are current. In the private league workspace, reconcile the new export and capture the actual recorded game logs. No background import or automatic league actions are implied.
2. Run the private workspace’s node scripts/prepare-indigo-week.mjs to retain existing personalities/universities and prepare the evidence-based commission. Write the five priority recaps, power ranking, three season columns (one exclusively about another club), full slate preview and draft feature using the same writer profiles.
3. The draft circuit is QB, HB/FB, WR/SLOT, TE, OL, DL, LB, DB and K; then Top 32, then team needs. After the Indigo Bowl, publish Top 32 and team needs before resuming. Advance the saved history once per edition, never on a rebuild.
4. Build the public edition, validate its facts and copy the new frozen snapshot and prose into content/. Update content/latest.json. Retain every older snapshot, article ID, prediction and image. Corrections should be explicit commits; a new week must not rewrite an old report.
5. Run node scripts/build.mjs, inspect desktop/mobile pages and commit the intended content and code. GitHub Actions publishes only public/.

Current content originated in the owner’s league workspace with a documented evidence audit. Raw franchise saves, hidden ratings, strategy, research runs and credentials are excluded from this repository and deployment. Interview dialogue, writer opinions and universities are original league worldbuilding; game facts come from recorded results.

## Asset provenance

Team emblem geometry and pixel Pokémon icons use the league game’s public assets at all22pokemon.com. The five current feature images were created for this league. Historical images have content-based filenames and must not be replaced with a new week’s image. ESPN game-center layouts and user-supplied ranking examples informed the structure; their code, branding and article prose are not copied.
