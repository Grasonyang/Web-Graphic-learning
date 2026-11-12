import { useEffect, useState } from 'react'
import Hw1Fireworks from './hw1/Hw1Fireworks'
import Hw2Robot from './hw2/Hw2Robot'

const PAGES = {
  hw1: { label: 'HW1 · Canvas 粒子煙火', Component: Hw1Fireworks },
  hw2: { label: 'HW2 · Three.js 機器人', Component: Hw2Robot },
} as const

type PageKey = keyof typeof PAGES

function readHash(): PageKey {
  const key = window.location.hash.replace('#/', '')
  return key in PAGES ? (key as PageKey) : 'hw1'
}

export default function App() {
  const [page, setPage] = useState<PageKey>(readHash)

  useEffect(() => {
    const onHash = () => setPage(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const { Component } = PAGES[page]

  return (
    <div className="app">
      <nav className="nav">
        {(Object.keys(PAGES) as PageKey[]).map((key) => (
          <a key={key} href={`#/${key}`} className={key === page ? 'active' : ''}>
            {PAGES[key].label}
          </a>
        ))}
      </nav>
      <main className="stage">
        <Component />
      </main>
    </div>
  )
}
