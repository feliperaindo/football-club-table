const test = `SELECT 
home.team_name AS teamName,
(home.total_points + away.total_points) AS totalPoints,
(home.total_games + away.total_games) AS totalGames,
(home.goals_favor + away.goals_favor) AS goalsFavor,
(home.goals_own + away.goals_own) AS goalsOwn,
((home.goals_favor + away.goals_favor) - (home.goals_own + away.goals_own)) AS goalsBalance,
(home.winners + away.winners) AS totalVictories,
(home.loses + away.loses) AS totalLosses,
(home.draws + away.draws) AS totalDraws
FROM
(SELECT 
    t.team_name AS team_name,
        COUNT(m.home_team_id) AS total_games,
        SUM(m.home_team_goals) AS goals_favor,
        SUM(m.away_team_goals) AS goals_own,
        SUM(m.home_team_goals) - SUM(m.away_team_goals) AS goals_balance,
        SUM(IF(m.home_team_goals > m.away_team_goals, 1, 0)) AS winners,
        SUM(IF(m.home_team_goals < m.away_team_goals, 1, 0)) AS loses,
        SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS draws,
        (SUM(IF(m.home_team_goals > m.away_team_goals, 1, 0)) * 3) 
          + SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS total_points
FROM
    matches AS m
LEFT JOIN teams AS t ON t.id = m.home_team_id
WHERE
    m.in_progress = FALSE
GROUP BY m.home_team_id) AS home
    INNER JOIN
(SELECT 
    t.team_name AS team_name,
        COUNT(m.away_team_id) AS total_games,
        SUM(m.home_team_goals) AS goals_own,
        SUM(m.away_team_goals) AS goals_favor,
        SUM(m.away_team_goals) - SUM(m.home_team_goals) AS goals_balance,
        SUM(IF(m.home_team_goals < m.away_team_goals, 1, 0)) AS winners,
        SUM(IF(m.home_team_goals > m.away_team_goals, 1, 0)) AS loses,
        SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS draws,
        (SUM(IF(m.home_team_goals < m.away_team_goals, 1, 0)) * 3)
          + SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS total_points
FROM
    matches AS m
LEFT JOIN teams AS t ON t.id = m.away_team_id
WHERE
    m.in_progress = FALSE
GROUP BY m.away_team_id) AS away ON home.team_name = away.team_name
ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC`;

export default test;
