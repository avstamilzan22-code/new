const REAL_OWNER = "94764642432";

function normalizeNumber(input) {
  if (!input) return '';
  let num = input.split('@')[0];
  num = num.split(':')[0];
  num = num.replace(/[^0-9]/g, '');
  return num;
}

function normalizeJid(jid) {
  if (!jid) return '';
  const parts = jid.split('@');
  const user = parts[0].split(':')[0];
  const domain = parts[1] || '';
  return user + '@' + domain;
}

function getSessionOwner(sockUser) {
  if (!sockUser?.id) return '';
  return normalizeNumber(sockUser.id);
}

function getSessionJid(sockUser) {
  const num = getSessionOwner(sockUser);
  if (!num) return '';
  return num + '@s.whatsapp.net';
}

function getOwnerList(sockUserId) {
  const owners = [REAL_OWNER];
  if (sockUserId) {
    const sessionNum = normalizeNumber(sockUserId);
    if (sessionNum && !owners.includes(sessionNum)) {
      owners.push(sessionNum);
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

function isOwner(senderJid, sockUser) {
  if (!senderJid || !sockUser) return false;

  // Self-check: sender matches bot's own JIDs (handles LID format)
  const normalizedSender = normalizeJid(senderJid);
  const botJids = getBotJids(sockUser);
  if (botJids.includes(normalizedSender)) return true;

  const senderNum = normalizeNumber(senderJid);
  if (!senderNum) return false;

  if (senderNum === REAL_OWNER) return true;

  const sessionNum = getSessionOwner(sockUser);
  if (sessionNum && senderNum === sessionNum) return true;

  return false;
}

function isRealOwner(senderJid) {
  return normalizeNumber(senderJid) === REAL_OWNER;
}

const configNumbers = [REAL_OWNER];

module.exports = { normalizeNumber, normalizeJid, isOwner, isRealOwner, getOwnerList, getBotJids, configNumbers, getSessionOwner, getSessionJid };
