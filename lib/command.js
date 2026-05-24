const settings = require('./settings');

var commands = [];

function cmd(info, func) {
    var data = info;
    data.function = func;
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!info.desc) info.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!info.category) data.category = 'misc';
    if(!info.filename) data.filename = "Not Provided";

    // Check category plugin toggle: PLUGIN_<CATEGORY>
    try {
        const key = 'PLUGIN_' + String(data.category).toUpperCase().replace(/[^A-Z0-9]/g, '_');
        const val = settings.get(key);
        // If explicitly set to 'false', skip registering this command
        if (val === 'false') return null;
    } catch (e) {
        // ignore and continue registering
    }

    commands.push(data);
    return data;
}
module.exports = {
    cmd,
    AddCommand:cmd,
    Function:cmd,
    Module:cmd,
    commands,
};
