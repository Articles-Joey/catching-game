import { Suspense } from "react"
import LobbyPage from "."

export const metadata = {
    title: `Catching Game Lobby`,
}

export default function Home() {

  return (
    <Suspense><LobbyPage /></Suspense>
  )

}
