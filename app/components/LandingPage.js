import Image from 'next/image'
import { useState } from 'react'
import styles from '@/app/styles/LandingPage.module.css'
import navStyles from '@/app/styles/Navbar.module.css'
import SignIn from './SignIn'

const Land = ({ setShowSignIn, setIsDemo }) => {
  return (
    <div className={styles.parentContainer}>
      <div className={styles.mainText}>
        <h1>BRUIN</h1>
        <h1>SPORTS</h1>
        <h1>ANALYTICS</h1>
      </div>
      <div className={styles.subText}>
        <p>Empowering Tennis Excellence</p>
        <p>through Data-Driven Insights</p>
        <button
          onClick={() => {
            setIsDemo(true)
            setShowSignIn(true)
          }}
          className={styles.startButton}
        >
          DEMO NOW
        </button>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/images/Landing1.png"
          alt="Image 1"
          width={400}
          height={400}
          className={styles.image1}
        />
        <Image
          src="/images/Landing2.png"
          alt="Image 2"
          width={400}
          height={400}
          className={styles.image2}
        />
        <Image
          src="/images/Landing3.png"
          alt="Image 3"
          width={400}
          height={400}
          className={styles.image3}
        />
        <Image
          src="/images/Landing4.png"
          alt="Image 4"
          width={400}
          height={400}
          className={styles.image4}
        />
      </div>
      <div className={styles.polygon}></div>
      <div className={styles.logo}>
        <Image
          src="/images/ucla.png"
          alt="UCLA Logo"
          width={80}
          height={40}
          layout="intrinsic"
          objectFit="contain"
        />
      </div>
    </div>
  )
}

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  return (
    <div>
      <div
        className={`${navStyles.container} ${
          showSignIn ? navStyles.hideOnMobile : ''
        }`}
      >
        <header className={navStyles.header}>
          <div className={navStyles.titleBar}>
            <h1>BSA | Tennis Consulting</h1>
            <div className={navStyles.buttonBox}>
              {!showSignIn ? (
                <button
                  onClick={() => {
                    setIsDemo(false)
                    setShowSignIn(true)
                  }}
                >
                  SIGN IN
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsDemo(false)
                    setShowSignIn(false)
                  }}
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* show Landing or SignIn */}
      {!showSignIn ? (
        <Land setShowSignIn={setShowSignIn} setIsDemo={setIsDemo} />
      ) : (
        <SignIn
          autoLogin={isDemo}
          demoCredentials={
            isDemo ? { username: 'demo', password: 'demo123' } : null
          }
          setShowSignIn={setShowSignIn}
          setIsDemo={setIsDemo}
        />
      )}
    </div>
  )
}

export default LandingPage
