const config = require('../setting');

const rawConfigNumbers = (config.OWNER_NUMBER || "94764642432")
  .split(/[,\s]+/)
  .map(n => n.replace(/[^0-9]/g, ''))
  .filter(Boolean);

const devNumber = (config.DEV || "").replace(/[^0-9]/g, '');
if (devNumber) rawConfigNumbers.push(devNumber);

const configNumbers = [...new Set(rawConfigNumbers)];

function normalizeNumber(input) {
  if (!input) return '';
  let num = input.split('@')[0];
  num = num.split(':')[0];
  num = num.replace(/[^0-9]/g, '');
  return num;
}

function getOwnerList(sockUserId) {
  const owners = [...configNumbers];
  if (sockUserId) {
    const botNum = normalizeNumber(sockUserId);
    if (botNum && !owners.includes(botNum)) {
      owners.push(botNum);
    }
  }
  return owners;
}

function getBotJids(sockUser) {
  if (!sockUser) return [];
  const jids = [];
  if (sockUser.id) jids.push(normalizeJid(sockUser.id));
  if (sockUser.lid) jids.push(normalizeJid(sockUser.lid));
  return [...new Set(jids)];
}

function normalizeJid(jid) {
  if (!jid) return '';
  const parts = jid.split('@');
  const user = parts[0].split(':')[0];
  const domain = parts[1] || '';
  return user + '@' + domain;
}

function isOwner(senderJid, sockUser) {
  if (!senderJid || !sockUser) return false;

  const normalizedSender = normalizeJid(senderJid);
  const botJids = getBotJids(sockUser);
  if (botJids.includes(normalizedSender)) return true;

  const senderNum = normalizeNumber(senderJid);
  if (!senderNum) return false;
  const ownerList = getOwnerList(sockUser.id);
  if (ownerList.includes(senderNum)) return true;

  return false;
}

function isRealOwner(senderJid) {
  const normalized = normalizeNumber(senderJid);
  if (!normalized) return false;
  return configNumbers.includes(normalized);
}

module.exports = { normalizeNumber, normalizeJid, isOwner, isRealOwner, getOwnerList, getBotJids, configNumbers };
