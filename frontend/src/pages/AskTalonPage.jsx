import React, { useMemo, useRef, useState } from 'react'
import {
  ArrowUp,
  AudioLines,
  ChevronDown,
  Copy,
  CornerDownRight,
  Link,
  Mic,
  MoreHorizontal,
  PanelRight,
  Plus,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react'
import { useRBACStore } from '../store/rbacStore'
import { askTalon } from '../utils/api'
import './AskTalonPage.css'

const starterPrompts = [
  { label: 'Summarize a verification record', prompt: 'Summarize this Talon verification record: ' },
  { label: 'Explain a risk signal', prompt: 'Explain this Talon risk signal: ' }
]

const followUpPrompts = [
  { label: 'Summarize recent sessions', prompt: 'Summarize recent verification sessions.' },
  { label: 'Explain flagged evidence', prompt: 'Explain the flagged evidence in this session.' }
]

function AssistantActions() {
  return (
    <div className="ask-message-actions" aria-label="Message actions">
      <button type="button" aria-label="Copy response" title="Copy response"><Copy size={16} /></button>
      <button type="button" aria-label="Copy link" title="Copy link"><Link size={16} /></button>
      <button type="button" aria-label="Helpful" title="Helpful"><ThumbsUp size={16} /></button>
      <button type="button" aria-label="Not helpful" title="Not helpful"><ThumbsDown size={16} /></button>
      <button type="button" aria-label="Regenerate" title="Regenerate"><RefreshCcw size={16} /></button>
      <button type="button" aria-label="More actions" title="More actions"><MoreHorizontal size={16} /></button>
    </div>
  )
}

export default function AskTalonPage() {
  const currentUser = useRBACStore(state => state.users.find(user => user.id === state.currentUserId))
  const userName = currentUser?.fullName || 'Authorized user'
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const sendMessage = async (message = draft) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isLoading) return
    const nextMessages = [...messages, { role: 'user', content: trimmedMessage }]
    setMessages(nextMessages)
    setDraft('')
    setError('')
    setIsLoading(true)
    try {
      const result = await askTalon(trimmedMessage, messages, userName)
      setMessages([...nextMessages, { role: 'assistant', content: result.answer }])
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Talon could not answer right now.')
    } finally {
      setIsLoading(false)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  const resetChat = () => {
    setMessages([])
    setError('')
    setDraft('')
  }

  return (
    <div className="ask-talon-page">
      <div className="ask-top-actions" aria-label="Chat tools">
        <button type="button" aria-label="More options" title="More options"><MoreHorizontal size={18} /></button>
        <button type="button" aria-label="Copy chat link" title="Copy chat link"><Link size={18} /></button>
        <button type="button" aria-label="Toggle side panel" title="Toggle side panel"><PanelRight size={18} /></button>
      </div>

      <main className={`ask-talon-workspace ${messages.length ? 'has-messages' : ''}`} aria-label="Ask Talon chat">
        {!messages.length ? (
          <div className="ask-talon-empty">
            <h1>How can I help you today?</h1>
          </div>
        ) : (
          <div className="ask-message-list">
            {messages.map((message, index) => (
              <article className={`ask-message ${message.role}`} key={`${message.role}-${index}`}>
                <p>{message.content}</p>
                {message.role === 'assistant' && <AssistantActions />}
              </article>
            ))}
            {isLoading && <article className="ask-message assistant"><p className="ask-loading">Thinking<span>.</span><span>.</span><span>.</span></p></article>}
            {!isLoading && messages.some(message => message.role === 'assistant') && (
              <div className="ask-followups">
                {followUpPrompts.map(({ label, prompt }) => (
                  <button key={label} type="button" onClick={() => { setDraft(prompt); requestAnimationFrame(() => inputRef.current?.focus()) }}>
                    <CornerDownRight size={17} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!messages.length && <div className="ask-suggestions">
          {starterPrompts.map(({ label, prompt }) => <button key={label} type="button" onClick={() => { setDraft(prompt); requestAnimationFrame(() => inputRef.current?.focus()) }}>{label}</button>)}
        </div>}
      </main>

      <section className="ask-composer-dock" aria-label="Message composer">
        {error && <p className="ask-error" role="alert">{error}</p>}
        <button className="ask-scroll-button" type="button" aria-label="Scroll to latest message" title="Scroll to latest message"><ChevronDown size={16} /></button>
        <form
          className="ask-composer"
          onClick={() => inputRef.current?.focus()}
          onSubmit={event => { event.preventDefault(); sendMessage() }}
        >
          <textarea
            ref={inputRef}
            id="ask-talon-message"
            name="message"
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage(event.currentTarget.value)
              }
            }}
            placeholder="Ask anything"
            rows="2"
            aria-label="Message Talon"
            autoComplete="off"
            disabled={isLoading}
          />
          <div className="ask-composer-tools">
            <button type="button" aria-label="Attach evidence" title="Attach evidence"><Plus size={22} /></button>
            <div className="ask-composer-right">
              <button className="ask-speed-button" type="button" aria-label="Response speed" title="Response speed">Fast <ChevronDown size={15} /></button>
              <button type="button" aria-label="Voice input" title="Voice input"><Mic size={18} /></button>
              <button className="ask-voice-button" type="button" aria-label="Voice mode" title="Voice mode"><AudioLines size={22} /></button>
              <button
                className="ask-send-button"
                type="submit"
                disabled={!draft.trim() || isLoading}
                aria-label="Send message"
                title="Send message"
                onClick={event => event.stopPropagation()}
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </form>
        {messages.length > 0 && <button className="ask-reset-button" type="button" onClick={resetChat} aria-label="Start a new chat"><RefreshCcw size={14} /> New chat</button>}
      </section>
    </div>
  )
}
