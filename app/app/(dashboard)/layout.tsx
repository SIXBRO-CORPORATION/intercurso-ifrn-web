import { AccessGate } from "@/features/auth/components/access-gate"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>
        <AccessGate>{children}</AccessGate>
      </DashboardShell>
    </AuthGuard>
  )
}
