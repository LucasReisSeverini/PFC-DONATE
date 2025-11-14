import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    // Configurações para vídeos
    video: true,                 // Habilita gravação de vídeo
    videosFolder: "cypress/videos", // Pasta onde os vídeos serão salvos
    trashAssetsBeforeRuns: true, // Limpa vídeos antigos antes de cada execução
  },
});
