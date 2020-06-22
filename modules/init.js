class FCE {
  static copy() {
    let data = this.getData();
    let text = `Core Version: ${data.core}\n\n`;

    text += `System: ${data.system.id} ${data.system.data.version} (${data.system.data.author}) \n\n`;

    text += `Modules: \n`;
    data.modules.forEach(m => {
      text += `${m.id} ${m.data.version} (${m.data.author})\n`;
    });

    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    console.log(text);

    ui.notifications.info("Environment data copied to clipboard!", {});
  }

  static save() {
    let data = this.getData();

    data.core = { version: data.core };
    data.system = {
      id: data.system.id,
      version: data.system.data.version,
      author: data.system.data.author
    };
    data.modules = data.modules.map( m => { return {
      id: m.id,
      version: m.data.version,
      author: m.data.author
    }});

    let jsonStr = JSON.stringify(data, null, 4);
    console.log(data);

    const a = document.createElement('a');
    const file = new Blob([jsonStr], {type: 'plain/text'});

    a.href= URL.createObjectURL(file);
    a.download = 'foundry-environment.json';
    a.click();

    URL.revokeObjectURL(a.href);
  }

  static getData() {
    let modules = this.getModules();
    let system = game.data.system;
    let core = game.data.version;

    return {core, system, modules};
  }

  static getModules() {

    return game.data.modules.filter(m => m.active);
  }
}

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
      }
    ]);
  }
});
