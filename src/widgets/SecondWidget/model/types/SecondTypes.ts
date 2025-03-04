export type Status = "Finished" | "Ongoing" | "Scheduled"

export type Player = {
  kills: number
  username: string
}

export type Team = {
  name: string
  place: number
  players: Player[]
  points: number
  total_kills: number
}

export type MatchesList = {
  awayScore: 2
  awayTeam: Team
  homeScore: number
  homeTeam: Team
  status: Status
  time: string
  title: string
}[]
