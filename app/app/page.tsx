import { redirect } from "next/navigation"
import { href } from "@/core/routes/route-registry"

export default function Home() {
  redirect(href("matches"))
}
