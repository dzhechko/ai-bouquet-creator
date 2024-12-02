# AI Bouquet Creator

An AI-powered application for creating custom bouquet designs.

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `VITE_OPENAI_MODE`: (default: false)
  - Set to `false` to use only Yandex models
  - Set to `true` to enable both OpenAI and Yandex models

## Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5000