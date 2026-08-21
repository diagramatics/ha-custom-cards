# Repository Guide

## Overview

- This repository builds Home Assistant custom cards with React 19, TypeScript, Vite 6, Tailwind CSS v4, and `pnpm`.
- The production bundle is `dist/ha-custom-cards.js`, which is the file referenced by HACS.
- Cards are implemented as React components, then wrapped as custom elements for Home Assistant.

## Toolchain

- Use Node.js 22.x.
- Use `pnpm` 9.12.3 to match `packageManager` and CI.
- Install dependencies with `pnpm install`.

## Primary Commands

- `pnpm dev`: starts the Vite dev server on `http://localhost:5173` by default.
- `pnpm build`: builds the production bundles into `dist/`.
- `pnpm preview`: serves the built output.
- `pnpm lint`: runs `tsc -b` and type-aware Oxlint.

## Known Baseline State

- `pnpm build` currently passes on the baseline repository.
- `pnpm lint` does not currently pass on the baseline repository. If you are working on an unrelated change, do not assume a lint failure is caused by your edit.
- `src/lib/ha` is vendored Home Assistant helper code and is excluded from normal app TypeScript and Oxlint checks. Avoid editing it unless the task specifically requires it.

## Architecture

- `src/build.ts` is the main production entrypoint. It imports each card and registers it with `createReactCard(...)`.
- `src/lib/create-react-card.tsx` is the core wrapper. It:
  - creates a shadow root,
  - mounts the React tree,
  - exposes `hass`, `config`, `cardSize`, and `editMode` via signals,
  - optionally registers a config editor element,
  - pushes metadata into `window.customCards`.
- `src/cards/` contains the actual Lovelace card implementations.
- `src/components/ui/` contains shared UI primitives.
- `src/lib/hooks/hass-hooks.tsx` contains thin helpers around `hass.states` and Home Assistant formatting methods.

## Development Modes

- Standalone preview:
  - `index.html` loads `src/preview.tsx`.
  - `src/preview.tsx` renders cards locally with mock Home Assistant state from `src/mocks/`.
  - Use this mode for fast UI iteration without a live Home Assistant instance.
- Home Assistant integration:
  - `src/ha-dev.ts` injects the Vite client and `src/build.ts` into Home Assistant for local development with HMR.
  - Add `http://localhost:5173/src/ha-dev.ts` as a Lovelace JavaScript module resource in Home Assistant.

## Environment Variables

- `PORT`: overrides the Vite dev/preview port. Default is `5173`.
- `CORS_ORIGIN`: comma-separated list of additional allowed origins for the dev server and preview server.
- If Home Assistant is not running on localhost, set `CORS_ORIGIN` so the browser can load the dev module cleanly.

## Styling Notes

- `src/index.css` is the main Tailwind v4 stylesheet used inside card shadow roots.
- `src/global.css` is a deliberate workaround for Tailwind `@property` behavior with adopted stylesheets. Do not remove it casually.
- Cards rely on CSS custom properties that map onto Home Assistant theme variables. Preserve that pattern when extending styling.

## Card Changes

- When adding a new card:
  - create the card component in `src/cards/`,
  - register it in `src/build.ts`,
  - add a preview instance in `src/preview.tsx` when practical,
  - add or update mock entities in `src/mocks/` if the preview needs fake data.
- If the card supports Home Assistant's visual editor, pass an editor component into `createReactCard(...)`.
- Prefer following existing config naming and `hass.states[...]` access patterns unless there is a reason to refactor more broadly.

## Repository Quirks

- `index.html` currently loads both `src/preview.tsx` and `src/build.ts`, while `src/preview.tsx` also registers cards itself. Duplicate custom-element registration attempts are expected and are caught in `createReactCard(...)`.
- The top-level `README.md` contains stale setup wording. Prefer the verified workflow in this file when bootstrapping local development.

## Release Flow

- Releases are tag-driven via GitHub Actions.
- Running `pnpm version patch|minor|major` updates `package.json`, creates a tag, and `postversion` pushes commits and tags.
- CI builds the project and attaches `dist/ha-custom-cards.js` and its sourcemap to the GitHub release.
