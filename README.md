# React + Vite + CRXJS

This template helps you quickly start developing Chrome extensions with React, TypeScript and Vite. It includes the CRXJS Vite plugin for seamless Chrome extension development.

## Features

- React with TypeScript
- TypeScript support
- Vite build tool
- CRXJS Vite plugin integration
- Chrome extension manifest configuration

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

## Project Structure

- `src/popup/` - Extension popup UI
- `src/content/` - Content scripts
- `manifest.config.ts` - Chrome extension manifest configuration

## Documentation

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)

## Chrome Extension Development Notes

- Use `manifest.config.ts` to configure your extension
- The CRXJS plugin automatically handles manifest generation
- Content scripts should be placed in `src/content/`
- Popup UI should be placed in `src/popup/`

## TODOs
- Tratar error ao gerar dados
- Criar Preferência de erros (Ignorar, Preencher, Gerar...)
- Implementar sufixo de nomes duplicados em importação

- ====================== EM ANDAMENTO ==========================
- Criaçao de metodos customizados

- ========================== BONUS ==============================
- Escrever testes
- Adicionar botão de doação/feedback/issues
- Criar página de doação/feedback/issues/backlog/roadmap/changelog

- ========================= BACKLOG =============================
- Permitir criar métodos personalizados
- Detectar formulários