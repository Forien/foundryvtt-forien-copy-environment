import FCE from "./FCE.js";

Hooks.on("renderSettings", function (app, html, data) {
  if (game.user.isGM) {
    new ContextMenu(html, "div.game-system", [
      {
        name: "Copy as text",
        icon: '<i class="far fa-copy"></i>',
        callback: li => {
          FCE.copy();
        }
      },
      {
        name: "Save as JSON",
        icon: '<i class="fas fa-paste"></i>',
        callback: li => {
          FCE.save();
        }
      },
      /*{
        name: "Advanced…",
        icon: '<i class="fas fa-cogs"></i>',
        callback: li => {
          FCE.advanced();
        }
      },*/
      {
        name: "Export Settings",
        icon: '<i class="fas fa-file-export"></i>',
        callback: li => {
          FCE.export();
        }
      },
      {
        name: "Import Settings",
        icon: '<i class="fas fa-file-import"></i>',
        callback: li => {
          FCE.import();
        }
      }
    ]);
  }
});
