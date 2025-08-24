import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FileText, Download, Copy, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface TranscriptionPreviewProps {
  fileName?: string
  content?: string
  isLoading?: boolean
  onDownload?: () => void
}

export function TranscriptionPreview({ 
  fileName, 
  content, 
  isLoading = false,
  onDownload 
}: TranscriptionPreviewProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    if (!content) return
    
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copiado!",
        description: "Transcrição copiada para a área de transferência",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a transcrição",
        variant: "destructive",
      })
    }
  }

  if (!fileName && !isLoading) {
    return (
      <Card className="glow-card">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione um arquivo para ver a transcrição</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="truncate">
              {fileName || "Carregando..."}
            </span>
          </CardTitle>
          {!isLoading && content && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando transcrição...</p>
            </div>
          </div>
        ) : content ? (
          <ScrollArea className="h-96 w-full">
            <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-muted rounded-lg">
              {content}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Transcrição não disponível</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}