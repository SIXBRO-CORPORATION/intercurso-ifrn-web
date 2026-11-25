import { AccessGate } from "@/features/auth/components/access-gate"
import { AuthGuard } from "@/features/auth/components/auth-guard"
import { AppShell } from "@/features/shell/components/app-shell"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>
        <AccessGate>{children}</AccessGate>
      </AppShell>
    </AuthGuard>
  )
}
