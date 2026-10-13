import { AuthGuard } from "@/features/auth/components/auth-guard"
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  )
}
