# Home Assistant Custom Cards

This project uses React.

To start development, run three commands in three different terminals:

- `pnpm dev` to start the development server and view custom cards written in preview.tsx on http://localhost:5173

Use http://localhost:5173/src/ha-dev.ts in Home Assistant to view the custom cards.

## Releases and Versioning

This project uses GitHub Actions to automatically build and release the custom cards when a new version tag is pushed. To create a new release:

1. Make your changes to the codebase
2. Run one of the following commands to update the version in `package.json`, create a git tag, and push everything to GitHub:
   ```bash
   # For patch releases (bug fixes)
   pnpm version patch

   # For minor releases (new features)
   pnpm version minor

   # For major releases (breaking changes)
   pnpm version major
   ```

The `postversion` script will automatically push both the code changes and the new tag to GitHub.

The GitHub Actions workflow will then automatically:

- Build the project
- Create a GitHub release
- Attach the built files (`dist/ha-custom-cards.js` and `dist/ha-custom-cards.js.map`) to the release

Users can then download the latest release files directly from GitHub.

## References

- https://github.com/shannonhochkins/ha-component-kit/tree/master/packages/core/src/hooks

## Code quality

This project uses Oxc tooling: type-aware Oxlint for linting and Oxfmt for formatting.

- `pnpm lint` runs TypeScript checks and Oxlint.
- `pnpm lint:fix` applies Oxlint fixes.
- `pnpm fmt` formats the project with Oxfmt.
- `pnpm fmt:check` verifies formatting without changing files.

VS Code contributors should install the recommended Oxc extension. The included workspace settings use Oxfmt automatically whenever a file is saved.
