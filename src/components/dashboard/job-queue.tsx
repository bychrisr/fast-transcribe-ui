import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FileAudio, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react"

export interface Job {
  id: string
  fileName: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  eta?: string
  createdAt: string
  folderId?: string
}

interface JobQueueProps {
  jobs: Job[]
  onRemoveJob: (jobId: string) => void
}

export function JobQueue({ jobs, onRemoveJob }: JobQueueProps) {
  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <LoadingSpinner size="sm" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusVariant = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'processing':
        return 'default'
      case 'completed':
        return 'success' as any
      case 'failed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return 'Na fila'
      case 'processing':
        return 'Processando'
      case 'completed':
        return 'Concluído'
      case 'failed':
        return 'Falhou'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="glow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="h-5 w-5 text-primary" />
          Fila de Processamento
          {jobs.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {jobs.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileAudio className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum arquivo em processamento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate" title={job.fileName}>
                      {job.fileName}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enviado às {formatTime(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={getStatusVariant(job.status)}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1">{getStatusText(job.status)}</span>
                    </Badge>
                    {(job.status === 'completed' || job.status === 'failed') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveJob(job.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {job.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>{job.progress}% concluído</span>
                      {job.eta && <span>ETA: {job.eta}</span>}
                    </div>
                    <Progress value={job.progress} className="w-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}