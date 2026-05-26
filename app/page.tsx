import { ClubsPage } from "@/components/clubs-page"
import { fetchClubs } from "@/lib/fetch-clubs"

export const revalidate = 300 // ISR: revalidate every 5 minutes

export default async function Home() {
  const { clubs, categories, debug } = await fetchClubs()
  return <ClubsPage initialClubs={clubs} initialCategories={categories} debug={debug} />
}
