'use client'

import { useState } from 'react'

export default function TestButton() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-4 bg-red-100 rounded">
      <p>Test Count: {count}</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Test Click (+1)
      </button>
    </div>
  )
}