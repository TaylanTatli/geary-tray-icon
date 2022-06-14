/* exported init */

const GETTEXT_DOMAIN = 'geary-tray-icon';

const { GObject, St } = imports.gi;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Geary Tray Icon'));

        let box = new St.BoxLayout({ style_class: 'panel-status-menu-box' });
        box.add_child(new St.Icon({
            icon_name: 'mail-mark-unread-symbolic',
            style_class: 'system-status-icon',
        }));
        box.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.add_child(box);

        let open_mail_item = new PopupMenu.PopupMenuItem(_('Open Mailbox'));
        open_mail_item.connect('activate', () => {
          GLib.spawn_command_line_async("geary");
        });
        this.menu.addMenuItem(open_mail_item);

        let new_mail_item = new PopupMenu.PopupMenuItem(_('New Mail'));
        new_mail_item.connect('activate', () => {
          GLib.spawn_command_line_async("geary mailto:");
        });
        this.menu.addMenuItem(new_mail_item);
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
