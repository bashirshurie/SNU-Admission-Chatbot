"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Send,
  User,
  Sparkles,
  RefreshCw,
  GraduationCap,
  CheckCircle,
  MapPin,
  ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Quick Prompt Suggestions                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

const QUICK_PROMPTS = [
  { label: "Shuruudaha gelitaanka 2026?" },
  { label: "Maxay yihiin 12-ka kulliyadood?" },
  { label: "Link-ka rasmiga ah ee diiwaangelinta?" },
  { label: "Haddii aan 2021 galay F4 ma isdiiwaangelin karaa?" },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/* Feature Cards for Welcome Screen (exactly 3 — no fee card)                */
/* ─────────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: GraduationCap,
    color: "#1e3a5f",
    bg: "linear-gradient(135deg, #dbeafe, #eff6ff)",
    text: "12 Kulliyadood oo kala duwan",
  },
  {
    icon: MapPin,
    color: "#059669",
    bg: "linear-gradient(135deg, #d1fae5, #ecfdf5)",
    text: "3 Xarumo: KM4, Abudwaaq, Badhan",
  },
  {
    icon: CheckCircle,
    color: "#7c3aed",
    bg: "linear-gradient(135deg, #ede9fe, #f5f3ff)",
    text: "Codsiga online-ka ah ee sahlan",
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/* Helper: Render assistant message text with basic markdown-like formatting */
/* ─────────────────────────────────────────────────────────────────────────── */

function AssistantText({ content }: { content: string }) {
  // Split by double-newlines for paragraphs, then handle bold **text**
  const paragraphs = content.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((para, i) => {
        // Handle bullet lists
        if (para.trim().startsWith("- ") || para.trim().startsWith("• ")) {
          const items = para.split("\n").filter((l) => l.trim());
          return (
            <ul key={i} className="assistant-list">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^[-•]\s*/, ""))}</li>
              ))}
            </ul>
          );
        }
        // Handle numbered lists
        if (/^\d+\.\s/.test(para.trim())) {
          const items = para.split("\n").filter((l) => l.trim());
          return (
            <ol key={i} className="assistant-list">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^\d+\.\s*/, ""))}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="assistant-para">
            {renderInline(para)}
          </p>
        );
      })}
    </>
  );
}

function renderInline(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Chat Component                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    reload,
    error,
  } = useChat({ api: "/api/chat" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // Scroll to bottom ONLY when a NEW message appears (user submits or AI starts responding),
  // but DO NOT auto-scroll continuously while the AI is streaming tokens.
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      prevMessagesLength.current = messages.length;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Show scroll-to-bottom button when user scrolls up
  const handleScroll = () => {
    const el = messagesAreaRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setShowScrollBtn(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle quick prompt click
  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    append({ role: "user", content: prompt });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-root">
      {/* ─── Decorative background orbs ─── */}
      <div className="bg-orb bg-orb-1" aria-hidden />
      <div className="bg-orb bg-orb-2" aria-hidden />
      <div className="bg-orb bg-orb-3" aria-hidden />

      <div className="chat-container">
        {/* ─────────── Header (flex-none, always visible) ─────────── */}
        <header className="chat-header" role="banner">
          <div className="header-glow" aria-hidden />
          <div className="header-content">
            {/* Left: SNU Logo + Title */}
            <div className="header-left">
              <div className="header-icon" aria-hidden>
                <Image
                  src="/snu-logo.png"
                  alt="SNU Logo"
                  width={34}
                  height={34}
                  className="header-logo-img"
                  priority
                />
              </div>
              <div className="header-text">
                <div className="header-title">
                  Jaamacadda Ummadda Soomaaliyeed · JUS
                </div>
                <div className="header-subtitle">
                  Somali National University · SNU
                </div>
              </div>
            </div>

            {/* Right: Badge */}
            <div className="header-right">
              <div className="header-badge">
                <Sparkles size={11} strokeWidth={2.5} />
                <span>AI Assistant 2026/2027</span>
              </div>
              <div className="header-status">
                <span className="status-dot" aria-hidden />
                <span>Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* ─────────── Messages / Welcome (flex-1, only scrollable area) ─────────── */}
        <main
          className="messages-area"
          ref={messagesAreaRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {!hasMessages ? (
            /* ── Welcome Screen ── */
            <div className="welcome-screen">
              {/* SNU Logo avatar */}
              <div className="welcome-avatar-wrap">
                <div className="welcome-avatar-ring" aria-hidden />
                <div className="welcome-avatar">
                  <Image
                    src="/snu-logo.png"
                    alt="Somali National University Logo"
                    width={64}
                    height={64}
                    className="welcome-logo-img"
                    priority
                  />
                </div>
              </div>

              {/* Title */}
              <div className="welcome-title">
                Ku soo dhawoow Kaaliyaha
                <span className="welcome-title-accent"> Diiwaangelinta JUS</span>
              </div>
              <div className="welcome-subtitle">
                Waxaan kugu caawin karaa macluumaadka diiwaangelinta,
                kulliyadaha, shuruudaha, iyo wax walba oo ku saabsan
                Jaamacadda Ummadda Soomaaliyeed.
              </div>

              {/* Feature cards (exactly 3) */}
              <div className="features-grid three-col">
                {FEATURES.map((feature, i) => (
                  <div
                    className="feature-card"
                    key={feature.text}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div
                      className="feature-icon"
                      style={{ background: feature.bg, color: feature.color }}
                      aria-hidden
                    >
                      <feature.icon size={16} strokeWidth={2} />
                    </div>
                    <span className="feature-card-text">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Quick prompt chips */}
              <div className="quick-prompts-grid">
                <div className="quick-prompts-label">
                  <Sparkles size={12} strokeWidth={2} />
                  Su&apos;aalo caadi ah
                </div>
                <div className="quick-prompts">
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={prompt.label}
                      className="quick-prompt-chip"
                      onClick={() => handleQuickPrompt(prompt.label)}
                      type="button"
                      style={{ animationDelay: `${i * 0.06 + 0.3}s` }}
                      aria-label={`Ask: ${prompt.label}`}
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── Message List ── */
            <div className="message-list">
              {messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`message-row ${message.role}`}
                  style={{ animationDelay: `${Math.min(idx * 0.04, 0.3)}s` }}
                >
                  {/* Avatar */}
                  <div
                    className={`message-avatar ${message.role}`}
                    aria-hidden
                  >
                    {message.role === "assistant" ? (
                      <Image
                        src="/snu-logo.png"
                        alt="SNU"
                        width={22}
                        height={22}
                        className="bot-avatar-img"
                      />
                    ) : (
                      <User size={15} strokeWidth={2} />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`message-bubble ${message.role}`}>
                    {message.role === "assistant" ? (
                      <AssistantText content={message.content} />
                    ) : (
                      <span className="user-text">{message.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading / Thinking indicator */}
              {isLoading &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="thinking-row" aria-label="AI is thinking">
                    <div className="message-avatar assistant" aria-hidden>
                      <Image
                        src="/snu-logo.png"
                        alt="SNU"
                        width={22}
                        height={22}
                        className="bot-avatar-img"
                      />
                    </div>
                    <div className="thinking-bubble">
                      <div className="thinking-dots">
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                      </div>
                      <span className="thinking-label">Wuxuu diyaarinayaa jawaabta…</span>
                    </div>
                  </div>
                )}

              {/* Error state */}
              {error && (
                <div className="error-row">
                  <div className="error-bubble">
                    <span>⚠ Khalad ayaa dhacay. Fadlan isku day mar kale.</span>
                    <button
                      className="retry-btn"
                      onClick={() => reload()}
                      type="button"
                    >
                      <RefreshCw size={13} strokeWidth={2.2} />
                      Isku day
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* ─── Scroll-to-bottom floating button ─── */}
        {showScrollBtn && hasMessages && (
          <button
            className="scroll-btn"
            onClick={scrollToBottom}
            aria-label="Scroll to latest message"
            type="button"
          >
            <ChevronDown size={18} strokeWidth={2.2} />
          </button>
        )}



        {/* ─────────── Input Bar (flex-none, always at bottom) ─────────── */}
        <footer className="input-bar-wrapper">
          <form
            onSubmit={handleSubmit}
            className={`input-bar${inputFocused ? " focused" : ""}`}
            aria-label="Message form"
          >
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Su'aashaada halkan ku qor…"
              disabled={isLoading}
              aria-label="Type your message"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              id="send-btn"
              type="submit"
              className="send-button"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <RefreshCw size={16} strokeWidth={2.2} className="spin-icon" />
              ) : (
                <Send size={16} strokeWidth={2.2} />
              )}
            </button>
          </form>
          <p className="input-hint">
            SNU AI Assistant · Macluumaadka waxaa lagu saleeyay xogta rasmiga ah ee jaamacadda
          </p>
        </footer>
      </div>
    </div>
  );
}
