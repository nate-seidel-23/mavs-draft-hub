// Calculate the average rank from the scout rankings
export const getAverageRank = (rankings) => {
  const values = Object.values(rankings).filter(val => typeof val === 'number');
  if (!values.length) return Infinity;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

export const mergePlayerData = (bio, scoutRankings) => {
  return scoutRankings.map(rankObj => {
    const player = bio.find(p => p.playerId === rankObj.playerId);
    if (!player) return null;
    const { playerId, ...scoutData } = rankObj;
    const average = getAverageRank(scoutData);
    return {
      ...player,
      scoutRankings: scoutData,
      averageRank: average,
    };
  }).filter(Boolean);
};
