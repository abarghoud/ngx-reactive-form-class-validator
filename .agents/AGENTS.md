# Guidelines for AI Agents: Nx & Angular Migrations and Releases

This document outlines the step-by-step workflow for upgrading Nx and Angular, verifying changes, and publishing releases in this repository. 

---

## 1. Upgrade & Migration Workflow

### Step 1.1: Target Version Check
1. Query the latest version of `@angular/core` and `nx` on npm:
   ```bash
   npm view @angular/core version
   npm view nx version
   ```
2. Check if the stable version of `@nx/angular` supports the target Angular version.
3. If the stable `@nx/angular` has a peer dependency cap that excludes the target Angular version, check the `next` tag:
   ```bash
   npm view @nx/angular@next version
   npm view @nx/angular@<next_version> peerDependencies
   ```
4. Generate the migration plan:
   * Use `yarn nx migrate latest` if stable supports the target version.
   * Use `yarn nx migrate next` if you need the pre-release version to support the target Angular version.

### Step 1.2: Node.js Version Requirements
Angular CLI has strict Node.js version requirements (e.g., Angular 22 requires Node `>=22.22.3` or `>=24.15.0`).
1. If the local Node version is incompatible, use `nvm` (which is installed in `~/.nvm/`) to install and switch to a compatible version:
   ```bash
   source ~/.nvm/nvm.sh && nvm install 24 && nvm use 24 && corepack enable
   ```
2. Run `yarn install`.
3. Run the migrations:
   ```bash
   yarn nx migrate --run-migrations
   ```

### Step 1.3: Common Compiler Issues
* **strictTemplates vs extendedDiagnostics**: If `extendedDiagnostics` is configured in `angularCompilerOptions`, `strictTemplates` must be set to `true`. Update this in:
  * [libs/ngx-reactive-form-class-validator/tsconfig.lib.json](file:///Users/abarghoud-merci/WebstormProjects/ngx-reactive-form-class-validator/libs/ngx-reactive-form-class-validator/tsconfig.lib.json)
  * [apps/test/tsconfig.app.json](file:///Users/abarghoud-merci/WebstormProjects/ngx-reactive-form-class-validator/apps/test/tsconfig.app.json)

---

## 2. Verification Workflow

Always run these verification steps before committing or submitting a PR:
1. **Unit Tests**: `yarn nx test ngx-reactive-form-class-validator`
2. **Linter**: `yarn lint`
3. **Library Build**: `yarn build:lib`
4. **Test App Build**: `yarn nx build test`
5. **Serve & Verify**: Run `yarn nx serve test` and verify that the test app runs in the browser without console errors.

---

## 3. Git & Pull Request (PR) Workflow

### Step 3.1: Branching
Always branch from **`develop`** for development and migrations:
```bash
git checkout develop
git pull origin develop
git checkout -b feat/upgrade-nx-angular-<version>
```

### Step 3.2: Commit Structure
Split your changes into two distinct commits:
1. **Commit 1 (`chore(angular): upgrade to Angular X and Nx Y`)**:
   * Contains all code migrations, package updates, lockfile changes, and tsconfig updates.
2. **Commit 2 (`Package version update`)**:
   * Bumps the library version in [libs/ngx-reactive-form-class-validator/package.json](file:///Users/abarghoud-merci/WebstormProjects/ngx-reactive-form-class-validator/libs/ngx-reactive-form-class-validator/package.json) (e.g., from `2.1.0` to `2.2.0`).
   * Updates the `peerDependencies` section in the root [README.md](file:///Users/abarghoud-merci/WebstormProjects/ngx-reactive-form-class-validator/README.md) to match the new version range.

### Step 3.3: Pull Request to `develop`
1. Push the branch and create a PR targeting **`develop`**.
2. Apply the following labels to the PR:
   * `type: dependencies`
   * `type: maintenance`

---

## 4. Release & Publishing Workflow

Once the migration PR is merged into `develop`:

### Step 4.1: Create Release PR to `main`
1. Create a PR from `develop` targeting **`main`**.
2. **Title**: `v<version>` (e.g., `v2.2.0`).
3. **Label**: Apply the `release: minor` (or `release: major`/`release: patch`) label.

### Step 4.2: Publish to NPM
Once the release PR is merged into `main`:
1. Checkout `main` locally and pull:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Build and pack the library using the packaging script. **CRITICAL**: Do NOT run `npm publish` directly after `yarn build:lib`. You MUST run the packaging script to copy the correct `README.md` and `LICENSE.txt` files:
   * If you need to bump the version: `yarn pre-publish:patch` (or `:minor`/`:major`).
   * If the version is already bumped: `yarn build:lib-pack`.
3. Publish to npm:
   ```bash
   cd dist/libs/ngx-reactive-form-class-validator
   npm publish
   ```

### Step 4.3: Publish GitHub Release
The `Release Drafter` workflow will automatically draft a release on GitHub. Go to the GitHub Releases page and publish the draft for the new version.
