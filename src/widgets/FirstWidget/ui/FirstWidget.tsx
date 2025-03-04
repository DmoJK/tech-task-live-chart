import { $api } from "@/shared/api/api"
import { useQuery } from "@tanstack/react-query"
import { MatchesList, Status } from "../model/types/FirstTypes"
import RefreshSVG from "@/shared/assets/Refresh.svg"
import AlertTriangleSVG from "@/shared/assets/AlertTriangle.svg"
import TeamSVG from "@/shared/assets/Team.svg"
import classes from "./FirstWidget.module.scss"

export const FirstWidget = () => {
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

  const mapStatusToColor: Record<Status, string> = {
    Finished: "#EB0237",
    Ongoing: "#43AD28",
    Scheduled: "#EB6402",
  }

  return (
    <div className={classes.main}>
      <div className={classes.title}>
        <h1>Match Tracker</h1>
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
        {data &&
          data.map((el) => (
            <div className={classes.item} key={el.time}>
              <div className={classes.team}>
                <TeamSVG />
                <p>{el.awayTeam.name}</p>
              </div>
              <div className={classes.info}>
                <p>
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
          ))}
      </div>
    </div>
  )
}
