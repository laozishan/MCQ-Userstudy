# MedMCQ React Prototype

React/Vite version of the MedMCQ expert review prototype.

## Local development

```bash
npm install
npm run dev
```

## Production preview

```bash
npm run build
npm run preview
```

## Smoke test

```bash
npm run smoke
```

The smoke test verifies setup navigation, Task 1/2/3 rendering, accept-to-bank persistence, and the question bank modal.

## Deploy

Recommended settings for Vercel or Netlify:

- Framework: Vite
- Build command: `npm run build`
- Publish/output directory: `dist`

GitHub Pages is also configured through `.github/workflows/deploy.yml`.
Push this project to `https://github.com/laozishan/medmcq.git` on the `main` branch, then enable Pages with source set to **GitHub Actions** in the repository settings.
