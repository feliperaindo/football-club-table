export const QUERY_LEADER = `
SELECT 
    home.team_name AS name,
    (home.total_points + away.total_points) AS totalPoints,
    (home.total_games + away.total_games) AS totalGames,
    (home.goals_favor + away.goals_favor) AS goalsFavor,
    (home.goals_own + away.goals_own) AS goalsOwn,
    ((home.goals_favor + away.goals_favor) - (home.goals_own + away.goals_own)) AS goalsBalance,
    (home.winners + away.winners) AS totalVictories,
    (home.loses + away.loses) AS totalLosses,
    (home.draws + away.draws) AS totalDraws,
    ROUND(((home.total_points + away.total_points) 
        / ((home.total_games + away.total_games) * 3) * 100), 2) AS efficiency
FROM
    (
        SELECT 
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
            TRYBE_FUTEBOL_CLUBE.matches AS m
        LEFT JOIN
            TRYBE_FUTEBOL_CLUBE.teams AS t
        ON t.id = m.home_team_id
        WHERE
            m.in_progress = FALSE
        GROUP BY m.home_team_id
    ) AS home
INNER JOIN
    (
        SELECT 
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
            TRYBE_FUTEBOL_CLUBE.matches AS m
        LEFT JOIN
            TRYBE_FUTEBOL_CLUBE.teams AS t
        ON t.id = m.away_team_id
        WHERE
            m.in_progress = FALSE
        GROUP BY m.away_team_id
        ) AS away
ON home.team_name = away.team_name
ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC;
`;

export const QUERY_HOME_LEADER = `
SELECT 
    t.team_name AS name,
    COUNT(m.home_team_id) AS totalGames,
    SUM(m.home_team_goals) AS goalsFavor,
    SUM(m.away_team_goals) AS goalsOwn,
    SUM(m.home_team_goals) - SUM(m.away_team_goals) AS goalsBalance,
    SUM(IF(m.home_team_goals > m.away_team_goals, 1, 0)) AS totalVictories,
    SUM(IF(m.home_team_goals < m.away_team_goals, 1, 0)) AS totalLosses,
    SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS totalDraws,
    (SUM(IF(m.home_team_goals > m.away_team_goals, 1, 0)) * 3)
        + SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS totalPoints,
    ROUND((((SUM(IF(m.home_team_goals > m.away_team_goals, 1, 0)) * 3)
    + SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0))) 
        / (COUNT(m.away_team_id) * 3) * 100), 2)   AS efficiency
FROM
    TRYBE_FUTEBOL_CLUBE.matches AS m
LEFT JOIN
    TRYBE_FUTEBOL_CLUBE.teams AS t
ON t.id = m.home_team_id
WHERE
    m.in_progress = FALSE
GROUP BY m.home_team_id
ORDER BY totalPoints DESC , totalVictories DESC , goalsBalance DESC , goalsFavor DESC;
`;

export const QUERY_AWAY_LEADER = `
SELECT 
    t.team_name AS name,
    COUNT(m.away_team_id) AS totalGames,
    SUM(m.home_team_goals) AS goalsOwn,
    SUM(m.away_team_goals) AS goalsFavor,
    SUM(m.away_team_goals) - SUM(m.home_team_goals) AS goalsBalance,
    SUM(IF(m.home_team_goals < m.away_team_goals, 1, 0)) AS totalVictories,
    SUM(IF(m.home_team_goals > m.away_team_goals, 1, 0)) AS totalLosses,
    SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS totalDraws,
    (SUM(IF(m.home_team_goals < m.away_team_goals, 1, 0)) * 3)
        + SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0)) AS totalPoints,
    ROUND((((SUM(IF(m.home_team_goals < m.away_team_goals, 1, 0)) * 3)
        + SUM(IF(m.home_team_goals = m.away_team_goals, 1, 0))) 
        / (COUNT(m.away_team_id) * 3) * 100), 2)   AS efficiency
FROM
    TRYBE_FUTEBOL_CLUBE.matches AS m
LEFT JOIN
    TRYBE_FUTEBOL_CLUBE.teams AS t
ON t.id = m.away_team_id
WHERE
    m.in_progress = FALSE
GROUP BY m.away_team_id
ORDER BY totalPoints DESC , totalVictories DESC , goalsBalance DESC , goalsFavor DESC;
`;
