import { $api } from "@/shared/api/api"
import { useQuery } from "@tanstack/react-query"
import { MatchesList, Player, Status } from "../model/types/SecondTypes"
import RefreshSVG from "@/shared/assets/Refresh.svg"
import AlertTriangleSVG from "@/shared/assets/AlertTriangle.svg"
import TeamSVG from "@/shared/assets/Team.svg"
import AvatarPNG from "@/shared/assets/Avatar.png"
import classes from "./SecondWidget.module.scss"
import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "@/shared/lib/hooks/useDebounce"

type filters = Status | "none"

export const SecondWidget = () => {
  const { isLoading, isRefetching, isError, isRefetchError, data, refetch } =
    useQuery({
      queryKey: ["matchesList"],
      queryFn: () =>
        $api.get("/fronttemp").then((resp) => {
          try {
            return resp.data.data.matches as MatchesList
          } catch (err) {
            return undefined
          }
        }),
    })
  const [sortedData, setSortedData] = useState<MatchesList | undefined>(
    undefined
  )

  const [filter, setFilter] = useState<filters>("none")
  const [openedMatchIndex, setOpenedMatchIndex] = useState<number | null>(null)
  const [isScoreChanging, setIsScoreChanging] = useState(false)

  const handleSetFilter = useCallback(
    (filter: filters) => {
      if (data) {
        if (filter === "none") {
          setSortedData(data)
        } else {
          setSortedData(data.filter((match) => match.status === filter))
        }
        setFilter(filter)
      }
    },
    [data]
  )

  const handleMapDetailItem = (el: Player) => {
    return (
      <div key={el.username}>
        <div>
          <img src={AvatarPNG} alt="" />
          <p>{el.username}</p>
        </div>
        <p>
          <span>Убийств:</span> {el.kills}
        </p>
      </div>
    )
  }

  const mapStatusToColor: Record<Status, string> = {
    Finished: "#EB0237",
    Ongoing: "#43AD28",
    Scheduled: "#EB6402",
  }

  const handleStopScoreChanging = useDebounce(() => {
    setIsScoreChanging(false)
  }, 200)

  useEffect(() => {
    setIsScoreChanging(true)
    handleStopScoreChanging()
  }, [sortedData])

  useEffect(() => {
    if (!sortedData && data) {
      setSortedData(data)
    }
  }, [data, sortedData])

  useEffect(() => {
    const socket = new WebSocket("wss://app.ftoyd.com/fronttemp-service/ws")

    socket.onmessage = (event) => {
      try {
        const { data: updatedData } = JSON.parse(event.data) as {
          data: MatchesList
        }
        setSortedData((prev) =>
          prev
            ? prev.map((sortedMatch) => {
                const newMatch = updatedData.find(
                  (newMatch) => sortedMatch.title === newMatch.title
                )

                if (newMatch) {
                  return newMatch
                }
                return sortedMatch
              })
            : updatedData
        )
      } catch (error) {
        console.error("Ошибка WebSocket", error)
      }
    }
    return () => {
      socket.close()
    }
  }, [])

  return (
    <div className={classes.main}>
      <div className={classes.title}>
        <div className={classes.titleLeftSection}>
          <h1>Match Tracker</h1>
          <div className={classes.select}>
            <select
              name="statuses"
              value={filter}
              onChange={(e) => handleSetFilter(e.target.value as filters)}
            >
              <option value="none">Все статусы</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Finished">Finished</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
        <div className={classes.titleRightSection}>
          {(isError || isRefetchError) && (
            <div className={classes.error}>
              <AlertTriangleSVG />
              <p>Ошибка: не удалось загрузить информацию</p>
            </div>
          )}
          <button
            onClick={() => refetch()}
            className={isRefetching || isLoading ? classes.loading : undefined}
          >
            Обновить
            <RefreshSVG />
          </button>
        </div>
      </div>
      <div className={classes.dashboard}>
        {sortedData &&
          sortedData.map((el, index) => (
            <div
              className={classes.itemBlock}
              key={el.title}
              onClick={() =>
                setOpenedMatchIndex((prev) => (index === prev ? null : index))
              }
            >
              <div className={classes.item}>
                <div className={classes.team}>
                  <TeamSVG />
                  <p>{el.awayTeam.name}</p>
                </div>
                <div className={classes.info}>
                  <p
                    className={
                      isScoreChanging ? classes.scoreChanging : undefined
                    }
                  >
                    {el.awayScore} : {el.homeScore}
                  </p>
                  <p
                    className={classes.chip}
                    style={{ backgroundColor: mapStatusToColor[el.status] }}
                  >
                    {el.status}
                  </p>
                </div>
                <div className={classes.team}>
                  <p>{el.homeTeam.name}</p>
                  <TeamSVG />
                </div>
              </div>
              {openedMatchIndex === index && (
                <div className={classes.itemDetail}>
                  <div className={classes.itemDetailTeam}>
                    <div className={classes.itemDetailTeamPlayers}>
                      {el.awayTeam.players.map(handleMapDetailItem)}
                    </div>
                    <div className={classes.itemDetailTeamInfo}>
                      <p>
                        <span>Points:</span> {el.awayTeam.points}
                      </p>
                      <p>
                        <span>Место:</span> {el.awayTeam.place}
                      </p>
                      <p>
                        <span>Всего убийств:</span> {el.awayTeam.total_kills}
                      </p>
                    </div>
                  </div>
                  <div className={classes.itemDetailTeam}>
                    <div className={classes.itemDetailTeamPlayers}>
                      {el.homeTeam.players.map(handleMapDetailItem)}
                    </div>
                    <div className={classes.itemDetailTeamInfo}>
                      <p>
                        <span>Points:</span> {el.homeTeam.points}
                      </p>
                      <p>
                        <span>Место:</span> {el.homeTeam.place}
                      </p>
                      <p>
                        <span>Всего убийств:</span> {el.homeTeam.total_kills}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
