import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const AuthForm = ({ type, onSubmit, email, setEmail, password, setPassword }) => (
    <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
    >
        <div>
            <label htmlFor="email" style={{display: 'block', marginBottom: '0.5rem'}}>이메일</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}}
                required
            />
        </div>
        <div>
            <label htmlFor="password" style={{display: 'block', marginBottom: '0.5rem'}}>비밀번호</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}}
                required
            />
        </div>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        >
            {type === 'login' ? '로그인' : '회원가입'}
        </motion.button>
    </motion.form>
);
function Home() {
    const router = useRouter();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  // handleLoginSubmit 및 handleSignupSubmit 함수는 그대로 유지
  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
          toast.success('로그인 성공!', {
              duration: 3000,
              position: 'top-center',
          });
          setTimeout(() => router.push('/mypage'), 3000);
      } else {
          toast.error(data.message || '로그인에 실패했습니다.', {
              duration: 5000,
              position: 'top-center',
          });
      }
    } catch (error) {
        toast.error('로그인 요청 중 오류가 발생했습니다.', {
            duration: 5000,
            position: 'top-center',
        });
    }
  };

  const handleSignupSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
          toast.success('회원가입 성공!', {
              duration: 3000,
              position: 'top-center',
          });
          setShowSignupForm(false);
      } else {
          toast.error(data.message || '회원가입에 실패했습니다.', {
              duration: 5000,
              position: 'top-center',
          });
      }
    } catch (error) {
        toast.error('회원가입 요청 중 오류가 발생했습니다.', {
            duration: 5000,
            position: 'top-center',
        });
    }
  };

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem'}}>
            <Head>
                <title>무제</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Toaster />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%'}}
            >
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>무제</h1>
                    <p style={{fontSize: '0.875rem', color: '#6B7280'}}>환영합니다!</p>
                </div>

                <AnimatePresence mode="wait">
                    {!showLoginForm && !showSignupForm && (
                        <motion.div
                            key="buttons"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowLoginForm(true)}
                                style={{padding: '0.5rem', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                            >
                                로그인
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSignupForm(true)}
                                style={{padding: '0.5rem', backgroundColor: 'white', color: '#4F46E5', border: '1px solid #4F46E5', borderRadius: '4px', cursor: 'pointer'}}
                            >
                                회원가입
                            </motion.button>
                        </motion.div>
                    )}

                    {showLoginForm && (
                        <AuthForm
                            key="login"
                            type="login"
                            onSubmit={handleLoginSubmit}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                        />
                    )}

                    {showSignupForm && (
                        <AuthForm
                            key="signup"
                            type="signup"
                            onSubmit={handleSignupSubmit}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                        />
                    )}
                </AnimatePresence>

                {(showLoginForm || showSignupForm) && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setShowLoginForm(false); setShowSignupForm(false); }}
                        style={{marginTop: '1rem', padding: '0.5rem', backgroundColor: 'transparent', color: '#4F46E5', border: '1px solid #4F46E5', borderRadius: '4px', cursor: 'pointer', width: '100%'}}
                    >
                        뒤로 가기
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}

export default Home;