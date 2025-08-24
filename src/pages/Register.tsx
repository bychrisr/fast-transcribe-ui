import { useNavigate } from "react-router-dom"
import { RegisterForm } from "@/components/auth/register-form"

export default function Register() {
  const navigate = useNavigate()

  const handleRegister = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock registration - in real app, create user with backend
    if (email && password) {
      // Store user info in localStorage (in real app, use proper auth tokens)
      localStorage.setItem('user', JSON.stringify({
        email,
        isAdmin: false
      }))
      navigate('/dashboard')
    } else {
      throw new Error('Registration failed')
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
        <RegisterForm onRegister={handleRegister} />
      </div>
    </div>
  )
}