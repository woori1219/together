# together

Private wedding invitation site for `woori1219`.

## Overview

- Stack: React + TypeScript + Vite
- Deploy target: GitHub Pages
- Homepage: `https://woori1219.github.io/together`

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is generated in the `build` directory.

## Environment variables

Create `.env` from `.env.example` and set values:

```bash
cp .env.example .env
```

- `VITE_NAVER_MAP_CLIENT_ID`
- `VITE_KAKAO_SDK_JS_KEY`
- `VITE_SERVER_URL`
- `VITE_STATIC_ONLY`
- `VITE_PREVIEW_IMAGE_VERSION`

## Content customization

- Main invitation data: `src/const.ts`
- Images and assets: `src/images`, `public/`
- Shared preview image: `public/preview_image.jpg`

## GitHub Pages deployment

This repository uses `.github/workflows/deploy.yml` to deploy on push to `main`.

Set these repository values before deployment:

- Secrets
  - `VITE_NAVER_MAP_CLIENT_ID`
  - `VITE_KAKAO_SDK_JS_KEY`
- Variables
  - `VITE_SERVER_URL`
  - `VITE_STATIC_ONLY`
  - `VITE_PREVIEW_IMAGE_VERSION`

Also confirm:

- `Settings > Pages > Build and deployment > Source = GitHub Actions`
- `Settings > Actions > General > Workflow permissions = Read and write permissions`

## Notes

- This is a private, personal project.
- Avoid committing sensitive personal data unless intentionally managed in private.
