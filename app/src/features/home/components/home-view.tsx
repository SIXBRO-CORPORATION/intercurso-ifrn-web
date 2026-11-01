"use client"

import { useActiveSeason } from "@/features/season"
import { HomeMatches } from "./home-matches"
import { HomeModalities } from "./home-modalities"
import { HomeSeasonEmpty, HomeSeasonError, HomeSeasonLoading, HomeSeasonSuccess } from "./home-season"

export function HomeView() {
  const result = useActiveSeason()
  const season = result.status === "success" ? result.season : null

  return (
    <div className="space-y-12">
      <section aria-label="Temporada" className="pt-4 md:pt-8">
        {result.status === "loading" && <HomeSeasonLoading />}
        {result.status === "error" && <HomeSeasonError />}
        {result.status === "success" && (season ? <HomeSeasonSuccess season={season} /> : <HomeSeasonEmpty />)}
      </section>
      {season && (
        <>
          <HomeMatches seasonId={season.season_id} />
          <HomeModalities seasonId={season.season_id} />
        </>
      )}
    </div>
  )
}
