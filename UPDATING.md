# Updating the upstream version

Upstream is splayed, built from source: the `upstream-project/` git submodule
(`https://github.com/BrashRatel/splayed`), with upstream's own `docker/Dockerfile`. splayed
publishes no image.

## Determining the upstream version

```sh
git -C upstream-project fetch --tags origin
git -C upstream-project describe --tags   # current pin
gh release view -R BrashRatel/splayed --json tagName -q .tagName   # latest release
```

The first package pins the `ui-deploy` branch (the web UI's proxied mode and the `WITH_TOR` build
argument), which is not merged into `main` yet. Move the pin to `main` or a release tag once it is.

## Applying the bump

1. `git -C upstream-project checkout <tag or commit>` and commit the submodule change.
2. Bump `version` in `startos/versions/current.ts` (upstream version, then `:` and the package
   revision), with release notes. Move the previous version into `startos/versions/` if it needs a
   migration.
3. Check upstream's `CHANGELOG.md` for changes to the env variables, `ui` flags or
   `config backend detect` that `startos/main.ts` relies on.
