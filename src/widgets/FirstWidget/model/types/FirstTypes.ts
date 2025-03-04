export type Status = 'Finished' | 'Ongoing' | 'Scheduled'

export type Team = {
  name: string
  place: number
  players: {
    kills: number
    username: string
  }[]
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
