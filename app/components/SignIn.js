import React, { useState, useEffect } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import styles from '@/app/styles/SignIn.module.css'
import Image from 'next/image'
import { FiChevronLeft } from 'react-icons/fi'

// autoLogin triggers autoLogin with demoCredentials
const SignIn = ({
  autoLogin = false,
  demoCredentials = null,
  setShowSignIn,
  setIsDemo
}) => {
  const [credentials, setCredentials] = useState({
    username: demoCredentials?.username || '',
    password: demoCredentials?.password || ''
  })
  const [error, setError] = useState(null)

  console.log(error)

  const handleSignIn = async (e) => {
    if (e) e.preventDefault()
    try {
      const auth = getAuth()
      const email = `${credentials.username}@ucla.edu` // Append @ucla.edu to the username
      await signInWithEmailAndPassword(auth, email, credentials.password)
      setError(null) // Clear any previous errors on successful sign-in
    } catch (error) {
      setError('The username or password is incorrect. Please try again.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  // if autoLogin is true and we have credentials, use it
  useEffect(() => {
    if (autoLogin && demoCredentials) {
      handleSignIn()
    }
  }, [autoLogin])

  return (
    <div className={styles.signInWrapper}>
      {/* BLUE POLYGON */}
      <div className={styles.mobilePolygon}></div>

      {/* IMAGE STACK */}
      <div className={styles.mobileImages}>
        <Image
          src="/images/Landing1.png"
          alt="Player 1"
          width={100}
          height={100}
          className={styles.mobileImage1}
        />
        <Image
          src="/images/Landing2.png"
          alt="Player 2"
          width={100}
          height={100}
          className={styles.mobileImage2}
        />
      </div>
      <div
        className={styles.mobileBackButton}
        onClick={() => {
          if (typeof window !== 'undefined') {
            setShowSignIn(false)
            setIsDemo(false)
          }
        }}
      >
        <FiChevronLeft />
      </div>

      <div className={styles.mobileHeader}>
        <h2>
          <span className={styles.welcome}>Welcome back,</span>
          <br />
          <span className={styles.continue}>Sign in to continue</span>
        </h2>
      </div>
      <div className={styles.container}>
        <form onSubmit={handleSignIn}>
          <div className={styles.card}>
            {error && (
              <div
                style={{
                  color: 'red',
                  marginBottom: '10px',
                  textAlign: 'center'
                }}
              >
                {error}
              </div>
            )}
            <h2>Sign in to your account</h2>
            <div>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <button type="submit">Sign In</button>
            <div className={styles.infoBox}>
              <p>
                Need Help?{' '}
                <a
                  href="mailto:uclatennisconsulting@gmail.com"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  <b>Contact Us</b>
                </a>
              </p>
              <p>To demo this page, use:</p>
              <ul>Username: demo</ul>
              <ul>Password: demo123</ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
