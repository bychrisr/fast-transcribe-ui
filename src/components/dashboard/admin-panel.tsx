import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Cloud, Settings, CheckCircle, XCircle, Clock } from "lucide-react"

export interface SyncSession {
  id: string
  status: 'running' | 'completed' | 'failed'
  totalFiles: number
  processedFiles: number
  startedAt: string
  completedAt?: string
  error?: string
}

interface AdminPanelProps {
  syncSessions: SyncSession[]
  onStartSync: () => Promise<void>
}

export function AdminPanel({ syncSessions, onStartSync }: AdminPanelProps) {
  const [isStartingSync, setIsStartingSync] = useState(false)
  const { toast } = useToast()

  const handleStartSync = async () => {
    setIsStartingSync(true)
    try {
      await onStartSync()
      toast({
        title: "Sincronização iniciada",
        description: "A sincronização com Google Drive foi iniciada",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a sincronização",
        variant: "destructive",
      })
    } finally {
      setIsStartingSync(false)
    }
  }

  const getStatusIcon = (status: SyncSession['status']) => {
    switch (status) {
      case 'running':
        return <LoadingSpinner size="sm" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusVariant = (status: SyncSession['status']) => {
    switch (status) {
      case 'running':
        return 'default'
      case 'completed':
        return 'success' as any
      case 'failed':
        return 'destructive'
    }
  }

  const getStatusText = (status: SyncSession['status']) => {
    switch (status) {
      case 'running':
        return 'Em execução'
      case 'completed':
        return 'Concluída'
      case 'failed':
        return 'Falhou'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const runningSession = syncSessions.find(session => session.status === 'running')

  return (
    <Card className="glow-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Painel Administrativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sync Button */}
        <div className="space-y-3">
          <Button
            onClick={handleStartSync}
            disabled={isStartingSync || !!runningSession}
            className="w-full"
            variant={runningSession ? "secondary" : "default"}
          >
            {isStartingSync ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Iniciando...
              </>
            ) : runningSession ? (
              <>
                <Cloud className="h-4 w-4 mr-2" />
                Sincronização em execução
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4 mr-2" />
                Sincronizar com Google Drive
              </>
            )}
          </Button>
          
          {runningSession && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso:</span>
                <span>
                  {runningSession.processedFiles} / {runningSession.totalFiles} arquivos
                </span>
              </div>
              <Progress 
                value={(runningSession.processedFiles / runningSession.totalFiles) * 100} 
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Sync Sessions History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Histórico de Sincronizações</h4>
          {syncSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma sincronização realizada ainda
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {syncSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="bg-muted rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusVariant(session.status)}>
                      {getStatusIcon(session.status)}
                      <span className="ml-1">{getStatusText(session.status)}</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(session.startedAt)}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <p>
                      Arquivos processados: {session.processedFiles} / {session.totalFiles}
                    </p>
                    {session.completedAt && (
                      <p className="text-muted-foreground text-xs">
                        Concluída em: {formatDateTime(session.completedAt)}
                      </p>
                    )}
                    {session.error && (
                      <p className="text-destructive text-xs">
                        Erro: {session.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}