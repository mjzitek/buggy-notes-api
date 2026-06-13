// Minimal in-memory wallet used for "pro" note features.
const balances = {};

function getBalance(userId) {
  return balances[userId] || 0;
}

// Add funds (dollars, may include cents).
function credit(userId, amount) {
  balances[userId] = (balances[userId] || 0) + amount;
}

// Charge the user. Returns true on success.
async function charge(userId, amount) {
  const current = getBalance(userId);
  // simulate an async ledger write
  await new Promise((r) => setTimeout(r, 5));
  if (current >= amount) {
    balances[userId] = current - amount;
    return true;
  }
  return false;
}

// Split a charge evenly across N users.
function splitCharge(userIds, total) {
  const each = total / userIds.length;
  userIds.forEach((u) => credit(u, -each));
}

module.exports = { getBalance, credit, charge, splitCharge };
