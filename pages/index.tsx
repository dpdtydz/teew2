import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export function Index() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        alert("로그인 성공!")
        // Redirect to mypage (you might want to use Next.js router here)
      } else {
        alert(data.message || "로그인에 실패했습니다.")
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error)
      alert("로그인 요청 중 오류가 발생했습니다.")
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        alert("회원가입 성공!")
        setShowSignupForm(false)
      } else {
        alert(data.message || "회원가입에 실패했습니다.")
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error)
      alert("회원가입 요청 중 오류가 발생했습니다.")
    }
  }

  const AuthForm = ({ type, onSubmit }: { type: "login" | "signup"; onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {type === "login" ? "로그인" : "회원가입"}
      </Button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">무제</CardTitle>
          <CardDescription className="text-center">환영합니다!</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!showLoginForm && !showSignupForm && (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Button onClick={() => setShowLoginForm(true)} className="w-full">
                  로그인
                </Button>
                <Button onClick={() => setShowSignupForm(true)} variant="outline" className="w-full">
                  회원가입
                </Button>
              </motion.div>
            )}
            {showLoginForm && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <AuthForm type="login" onSubmit={handleLoginSubmit} />
              </motion.div>
            )}
            {showSignupForm && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <AuthForm type="signup" onSubmit={handleSignupSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          {(showLoginForm || showSignupForm) && (
            <Button
              onClick={() => {
                setShowLoginForm(false)
                setShowSignupForm(false)
              }}
              variant="ghost"
              className="w-full"
            >
              뒤로 가기
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}