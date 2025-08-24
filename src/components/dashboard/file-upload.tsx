import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Upload, File, X } from "lucide-react"

interface FileUploadProps {
  folders: Array<{ id: string; name: string }>
  onUpload: (files: File[], folderId?: string) => Promise<void>
}

export function FileUpload({ folders, onUpload }: FileUploadProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [draggedFiles, setDraggedFiles] = useState<File[]>([])
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDraggedFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.mp4', '.avi', '.mov']
    },
    multiple: true
  })

  const handleUpload = async () => {
    if (draggedFiles.length === 0) return

    setIsUploading(true)
    try {
      await onUpload(draggedFiles, selectedFolder || undefined)
      setDraggedFiles([])
      setSelectedFolder("")
      toast({
        title: "Upload iniciado!",
        description: `${draggedFiles.length} arquivo(s) enviado(s) para processamento`,
      })
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar os arquivos",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setDraggedFiles(files => files.filter((_, i) => i !== index))
  }

  return (
    <Card className="glow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload de Áudio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`upload-area cursor-pointer ${isDragActive ? 'dragover' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary font-medium">Solte os arquivos aqui...</p>
          ) : (
            <div className="text-center">
              <p className="text-foreground font-medium mb-2">
                Arraste arquivos de áudio aqui
              </p>
              <p className="text-muted-foreground text-sm">
                ou clique para selecionar
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Suporta: MP3, WAV, M4A, FLAC, OGG, MP4, AVI, MOV
              </p>
            </div>
          )}
        </div>

        {draggedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Arquivos selecionados:</h4>
            {draggedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {folders.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Pasta de destino (opcional):</label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma pasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Pasta raiz</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {draggedFiles.length > 0 && (
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Enviando...
              </>
            ) : (
              `Enviar ${draggedFiles.length} arquivo(s)`
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}