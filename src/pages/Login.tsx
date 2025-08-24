import { useNavigate } from "react-router-dom"
import { LoginForm } from "@/components/auth/login-form"

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - in real app, validate with backend
    if (email && password) {
      // Store user info in localStorage (in real app, use proper auth tokens)
      localStorage.setItem('user', JSON.stringify({
        email,
        isAdmin: email.includes('admin')
      }))
      navigate('/dashboard')
    } else {
      throw new Error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Fast Transcribe
          </h1>
          <p className="text-muted-foreground">
            Transcrição de áudio com inteligência artificial
          </p>
        </div>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  )
}