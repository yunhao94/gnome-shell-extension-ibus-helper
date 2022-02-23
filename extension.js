/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const { Gio } = imports.gi;

const InputSourceManager = imports.ui.status.keyboard.getInputSourceManager();

const IfaceXml=`
<node>
  <interface name="org.gnome.Shell.IBusHelper">
    <method name="GetCurrentSourceIndex">
      <arg type="u" direction="out" name="index"/>
    </method>
    <method name="ActivateSource">
      <arg type="u" direction="in" name="index"/>
    </method>
  </interface>
</node>`;

class Extension {
    constructor() {
        this._dbusImpl = null;
    }

    enable() {
        this._dbusImpl = Gio.DBusExportedObject.wrapJSObject(IfaceXml, this);
        this._dbusImpl.export(Gio.DBus.session, "/org/gnome/Shell/IBusHelper");
    }

    disable() {
        this._dbusImpl.unexport();
        this._dbusImpl = null;
    }

    // Methods
    GetCurrentSourceIndex() {
        return InputSourceManager.currentSource.index;
    }

    ActivateSource(index) {
        InputSourceManager.inputSources[index].activate();
    }
}

function init() {
    return new Extension();
}
