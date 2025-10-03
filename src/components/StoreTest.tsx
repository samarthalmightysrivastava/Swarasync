'use client'

import { useGameStore } from '@/lib/store'

export default function StoreTest() {
  const { isPlaying, startGame, currentRound } = useGameStore()
  
  return (
    <div className="p-4 bg-yellow-100 rounded mb-4">
      <p>Store Test - Round: {currentRound}, Playing: {isPlaying ? 'Yes' : 'No'}</p>
      <button 
        onClick={() => {
          console.log('Store Test: Calling startGame()')
          startGame()
        }}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Test Store Start
      </button>
    </div>
  )
}