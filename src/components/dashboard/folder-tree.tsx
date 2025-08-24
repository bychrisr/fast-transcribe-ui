import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Folder, 
  FolderOpen, 
  File, 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2,
  Download
} from "lucide-react"

export interface FolderNode {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: FolderNode[]
  parentId?: string
  size?: number
}

interface FolderTreeProps {
  folders: FolderNode[]
  selectedFile?: string
  onFileSelect: (file: FolderNode) => void
  onCreateFolder: (parentId?: string) => void
  onRenameItem: (item: FolderNode) => void
  onDeleteItem: (item: FolderNode) => void
  onDownloadFile: (file: FolderNode) => void
}

interface TreeNodeProps {
  node: FolderNode
  level: number
  expandedFolders: Set<string>
  onToggleExpand: (folderId: string) => void
  selectedFile?: string
  onFileSelect: (file: FolderNode) => void
  onCreateFolder: (parentId?: string) => void
  onRenameItem: (item: FolderNode) => void
  onDeleteItem: (item: FolderNode) => void
  onDownloadFile: (file: FolderNode) => void
}

function TreeNode({
  node,
  level,
  expandedFolders,
  onToggleExpand,
  selectedFile,
  onFileSelect,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
  onDownloadFile
}: TreeNodeProps) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFile === node.id
  const paddingLeft = level * 20

  const handleClick = () => {
    if (node.type === 'folder') {
      onToggleExpand(node.id)
    } else {
      onFileSelect(node)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  return (
    <div>
      <div
        className={`flex items-center justify-between py-2 px-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
          isSelected ? 'bg-primary/10 border border-primary/20' : ''
        }`}
        style={{ paddingLeft: paddingLeft + 12 }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {node.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm truncate" title={node.name}>
            {node.name}
          </span>
          {node.type === 'file' && node.size && (
            <span className="text-xs text-muted-foreground">
              ({formatFileSize(node.size)})
            </span>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {node.type === 'folder' && (
              <DropdownMenuItem onClick={() => onCreateFolder(node.id)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova pasta
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onRenameItem(node)}>
              <Edit className="h-4 w-4 mr-2" />
              Renomear
            </DropdownMenuItem>
            {node.type === 'file' && (
              <DropdownMenuItem onClick={() => onDownloadFile(node)}>
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDeleteItem(node)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onCreateFolder={onCreateFolder}
              onRenameItem={onRenameItem}
              onDeleteItem={onDeleteItem}
              onDownloadFile={onDownloadFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree({
  folders,
  selectedFile,
  onFileSelect,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
  onDownloadFile
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleExpand = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <Card className="glow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            Arquivos
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateFolder()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova pasta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {folders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum arquivo encontrado</p>
            <p className="text-sm mt-1">Faça upload de arquivos de áudio para começar</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {folders.map((folder) => (
              <TreeNode
                key={folder.id}
                node={folder}
                level={0}
                expandedFolders={expandedFolders}
                onToggleExpand={toggleExpand}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                onCreateFolder={onCreateFolder}
                onRenameItem={onRenameItem}
                onDeleteItem={onDeleteItem}
                onDownloadFile={onDownloadFile}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}