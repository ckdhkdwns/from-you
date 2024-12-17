'use client'

import { useState } from 'react'
import { useTodos } from '../_hooks/useTodos'

export function TodoInput() {
  const [input, setInput] = useState('')
  const { addTodo } = useTodos()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      addTodo(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 rounded mr-2"
        placeholder="할 일을 입력하세요"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </form>
  )
}