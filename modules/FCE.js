export default class FCE {
  static getText() {
    let data = this.getData();
    let text = `Core Version: ${data.core}\n\n`;

    text += `System: ${data.system.id} ${data.system.data.version} (${data.system.data.author}) \n\n`;

    text += `Modules: \n`;
    data.modules.forEach(m => {
      text += `${m.id} ${m.data.version} (${m.data.author})\n`;
    });

    text += `\n${data.message}`;

    return text;
  }

  static copy() {
    let text = this.getText();

    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    ui.notifications.info("Environment data copied to clipboard!", {});
  }

  static save() {
    let data = this.getData();

    data.core = {version: data.core};
    data.system = {
      id: data.system.id,
      version: data.system.data.version,
      author: data.system.data.author,
      manifest: data.system.data.manifest
    };
    data.modules = data.modules.map(m => {
      return {
        id: m.id,
        version: m.data.version,
        author: m.data.author,
        manifest: m.data.manifest
      }
    });

    this.download(data, 'foundry-environment.json');
  }

  static download(data, filename = 'forien-copy-environment.json') {
    let jsonStr = JSON.stringify(data, null, 2);

    saveDataToFile(jsonStr, 'application/json', filename);
  }

  static export() {
    let data = game.data.settings.map(s => ({key: s.key, value: s.value}));
    this.download(data, 'foundry-settings-export.json');
  }

  static import() {
    const input = $('<input type="file">');
    input.on("change", this.importSettings);
    input.trigger('click');
  }

  static importSettings() {
    const file = this.files[0];
    if (!file) return;

    readTextFromFile(file).then(async result => {
      const settings = JSON.parse(result);
      for (const setting of settings) {
        await FCE.processSetting(setting);
      }
      location.reload();
    });
  }

  static async processSetting(setting) {
    const config = game.settings.settings.get(setting.key);
    if (config?.scope === "client") {
      const storage = game.settings.storage.get(config.scope);
      storage.setItem(setting.key, setting.value);
    } else if (game.user.isGM) {
      try {
        await SocketInterface.dispatch("modifyDocument", {
          type: "Setting",
          action: "update",
          data: setting
        });
      } catch (e) {
        console.log(`Setting key ${setting.key} could not be dispatched to server.`);
        console.error(e);
      }
    }
  }

  static getData() {
    let modules = this.getModules();
    let system = game.data.system;
    let core = game.data.version;

    let message = "List generated with Forien's Copy Environment: https://github.com/Forien/foundryvtt-forien-copy-environment";

    return {message, core, system, modules};
  }

  static getModules() {
    return game.data.modules.filter(m => m.active);
  }
}