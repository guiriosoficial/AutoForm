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
- ======================== BACKLOG ============================
- Exibir duplicidade métodos customizados na importação*
- Criar Preferência de erros (Ignorar, Preencher, Gerar...)
- Tratar error ao gerar dados
- Detectar formulários automaticamente
- Adicionar suporte a arquivos (Gerar XLS, CSV, PNG, JPG, PDF)
- Documentar possibilidade de Fetch em Custom Methods

- Criar preset inicial prontos
- Opção Keep All na importação
- Tratar nomes duplicados na importação (Inserir Timestamp)
- Personalizar melhor Editor de JS

- Corrigir erros de Lint (plugin react)

- Escrever testes
- Criar página e links de feedback/discussions/issues/backlog/roadmap/changelog

- ====================== EM ANDAMENTO ==========================
- Reorganizar pasta lib
- Revisar nomenclaturas no código
- Revisar códigos de dom (runners em lib)