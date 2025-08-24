import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/dashboard/file-upload"
import { JobQueue, Job } from "@/components/dashboard/job-queue"
import { FolderTree, FolderNode } from "@/components/dashboard/folder-tree"
import { TranscriptionPreview } from "@/components/dashboard/transcription-preview"
import { AdminPanel, SyncSession } from "@/components/dashboard/admin-panel"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, User, Settings } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // User state
  const [user, setUser] = useState<any>(null)
  
  // UI state
  const [selectedFile, setSelectedFile] = useState<FolderNode | null>(null)
  const [transcriptionContent, setTranscriptionContent] = useState("")
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false)
  
  // Modal states
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<FolderNode | null>(null)
  const [newName, setNewName] = useState("")
  const [parentFolderId, setParentFolderId] = useState<string>("")
  
  // Data state
  const [jobs, setJobs] = useState<Job[]>([])
  const [folders, setFolders] = useState<FolderNode[]>([])
  const [syncSessions, setSyncSessions] = useState<SyncSession[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
    
    // Load initial data
    loadFolders()
    loadJobs()
    if (JSON.parse(userData).isAdmin) {
      loadSyncSessions()
    }
  }, [navigate])

  const loadFolders = async () => {
    // Mock API call - replace with real API
    await new Promise(resolve => setTimeout(resolve, 500))
    setFolders([
      {
        id: 'folder-1',
        name: 'Reuniões',
        type: 'folder',
        children: [
          {
            id: 'file-1',
            name: 'reuniao-equipe.txt',
            type: 'file',
            size: 1024
          }
        ]
      },
      {
        id: 'file-2',
        name: 'entrevista-cliente.txt',
        type: 'file',
        size: 2048
      }
    ])
  }

  const loadJobs = async () => {
    // Mock API call - replace with real API
    await new Promise(resolve => setTimeout(resolve, 300))
    setJobs([
      {
        id: 'job-1',
        fileName: 'audio-exemplo.mp3',
        status: 'processing',
        progress: 65,
        eta: '2 min',
        createdAt: new Date().toISOString()
      }
    ])
  }

  const loadSyncSessions = async () => {
    // Mock API call - replace with real API
    await new Promise(resolve => setTimeout(resolve, 400))
    setSyncSessions([
      {
        id: 'sync-1',
        status: 'completed',
        totalFiles: 10,
        processedFiles: 10,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3000000).toISOString()
      }
    ])
  }

  const handleUpload = async (files: File[], folderId?: string) => {
    // Create jobs for uploaded files
    const newJobs = files.map(file => ({
      id: `job-${Date.now()}-${Math.random()}`,
      fileName: file.name,
      status: 'pending' as const,
      progress: 0,
      createdAt: new Date().toISOString(),
      folderId
    }))
    
    setJobs(prev => [...prev, ...newJobs])
    
    // Simulate processing
    newJobs.forEach(job => {
      setTimeout(() => {
        setJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: 'processing' } : j
        ))
        
        // Simulate progress
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 20
          if (progress >= 100) {
            clearInterval(interval)
            setJobs(prev => prev.map(j => 
              j.id === job.id ? { ...j, status: 'completed', progress: 100 } : j
            ))
            // Add file to folder tree
            setTimeout(() => loadFolders(), 1000)
          } else {
            setJobs(prev => prev.map(j => 
              j.id === job.id ? { ...j, progress: Math.min(progress, 100) } : j
            ))
          }
        }, 1000)
      }, Math.random() * 2000)
    })
  }

  const handleFileSelect = async (file: FolderNode) => {
    setSelectedFile(file)
    setIsLoadingTranscription(true)
    
    // Mock API call to get transcription
    await new Promise(resolve => setTimeout(resolve, 1000))
    setTranscriptionContent(`Esta é a transcrição do arquivo ${file.name}.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`)
    
    setIsLoadingTranscription(false)
  }

  const handleCreateFolder = (parentId?: string) => {
    setParentFolderId(parentId || "")
    setNewName("")
    setShowCreateFolder(true)
  }

  const handleRenameItem = (item: FolderNode) => {
    setCurrentItem(item)
    setNewName(item.name)
    setShowRenameDialog(true)
  }

  const handleDeleteItem = (item: FolderNode) => {
    setCurrentItem(item)
    setShowDeleteDialog(true)
  }

  const confirmCreateFolder = async () => {
    if (!newName.trim()) return
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast({
      title: "Pasta criada",
      description: `A pasta "${newName}" foi criada com sucesso`,
    })
    
    setShowCreateFolder(false)
    loadFolders()
  }

  const confirmRename = async () => {
    if (!newName.trim() || !currentItem) return
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast({
      title: "Item renomeado",
      description: `"${currentItem.name}" foi renomeado para "${newName}"`,
    })
    
    setShowRenameDialog(false)
    loadFolders()
  }

  const confirmDelete = async () => {
    if (!currentItem) return
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast({
      title: "Item excluído",
      description: `"${currentItem.name}" foi excluído com sucesso`,
    })
    
    setShowDeleteDialog(false)
    setSelectedFile(null)
    setTranscriptionContent("")
    loadFolders()
  }

  const handleStartSync = async () => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newSession: SyncSession = {
      id: `sync-${Date.now()}`,
      status: 'running',
      totalFiles: 25,
      processedFiles: 0,
      startedAt: new Date().toISOString()
    }
    
    setSyncSessions(prev => [newSession, ...prev])
    
    // Simulate progress
    let processed = 0
    const interval = setInterval(() => {
      processed += Math.floor(Math.random() * 5) + 1
      if (processed >= 25) {
        clearInterval(interval)
        setSyncSessions(prev => prev.map(s => 
          s.id === newSession.id 
            ? { ...s, status: 'completed', processedFiles: 25, completedAt: new Date().toISOString() }
            : s
        ))
      } else {
        setSyncSessions(prev => prev.map(s => 
          s.id === newSession.id 
            ? { ...s, processedFiles: Math.min(processed, 25) }
            : s
        ))
      }
    }, 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleDownload = () => {
    if (!selectedFile || !transcriptionContent) return
    
    const element = document.createElement('a')
    const file = new Blob([transcriptionContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = selectedFile.name
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!user) return null

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Fast Transcribe
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              {user.email}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <Settings className="h-4 w-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <FileUpload
            folders={folders.filter(f => f.type === 'folder')}
            onUpload={handleUpload}
          />
          <JobQueue
            jobs={jobs}
            onRemoveJob={(jobId) => setJobs(prev => prev.filter(j => j.id !== jobId))}
          />
          {user.isAdmin && (
            <AdminPanel
              syncSessions={syncSessions}
              onStartSync={handleStartSync}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <FolderTree
            folders={folders}
            selectedFile={selectedFile?.id}
            onFileSelect={handleFileSelect}
            onCreateFolder={handleCreateFolder}
            onRenameItem={handleRenameItem}
            onDeleteItem={handleDeleteItem}
            onDownloadFile={handleDownload}
          />
          <TranscriptionPreview
            fileName={selectedFile?.name}
            content={transcriptionContent}
            isLoading={isLoadingTranscription}
            onDownload={handleDownload}
          />
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Pasta</DialogTitle>
            <DialogDescription>
              Digite o nome para a nova pasta
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">Nome da pasta</Label>
            <Input
              id="folder-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome da pasta"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmCreateFolder} disabled={!newName.trim()}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Item</DialogTitle>
            <DialogDescription>
              Digite o novo nome para "{currentItem?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-name">Novo nome</Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Novo nome"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmRename} disabled={!newName.trim()}>
              Renomear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir "{currentItem?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}