const users = new Map(); 
const votes = new Map();

export const createUser = async ({ username, password }) => {
  if (users.has(username)) throw new Error('User already exists');
  const user = { username, password };
  users.set(username, user);
  return user;
};

export const updateUserPassword = async (username, newPassword) => {
  const user = users.get(username);
  if (!user) throw new Error('User not found');
  user.password = newPassword;
  users.set(username, user);
  return user;
};

export const findUser = async (query) => {
  if (query.username) return users.get(query.username) || null;
  return null;
};

export const getAllUsers = async () => {
  return Array.from(users.values());
};

export const findVoteBySessionId = async (sessionId) => {
  return votes.get(sessionId) || null;
};

export const saveVote = async ({ sessionId, option }) => {
  const vote = { sessionId, option, createdAt: new Date() };
  votes.set(sessionId, vote);
  return vote;
};

export const getVotes = async () => {
  return Array.from(votes.values());
};

export const computeTotals = async () => {
  const totals = { 'Option A': 0, 'Option B': 0, 'Option C': 0 };
  for (const v of votes.values()) {
    totals[v.option] = (totals[v.option] || 0) + 1;
  }
  return totals;
};

export default {
  createUser,
  findUser,
  getAllUsers,
  findVoteBySessionId,
  saveVote,
  getVotes,
  computeTotals,
};
