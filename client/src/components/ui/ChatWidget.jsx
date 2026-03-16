import { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';

const RESPONSES = {
  booking: ["I'd be delighted to arrange that. What are your preferred dates and suite type?", "Our suites are popular year-round. Booking 6 weeks ahead ensures the best availability."],
  spa: ["The Oceanic Spa has 12 treatment rooms. Shall I note a preferred treatment for your stay?", "Spa is open 9am–9pm daily. Signature Maldivian coral massage starts at $180."],
  dining: ["Chef Alessandro's table seats 8 and requires 48hr advance notice. Shall I note an interest?", "Dinner service runs 7–11pm. The 7:30pm sunset seating is our most sought-after."],
  room: ["All suites include butler service, fresh florals, and personalised turndown service.", "The Royal Penthouse at $8,900/night is our pinnacle offering, with helipad and private chef."],
  default: ["Of course — our concierge team is available 24/7 at +960 300 1924.", "Allow me to connect you with our reservations team for a personalised response.", "That's a wonderful question. What else may I assist you with?"],
};

function getReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('book') || m.includes('reserv') || m.includes('room') || m.includes('suite')) return RESPONSES.booking;
  if (m.includes('spa') || m.includes('massage') || m.includes('wellness')) return RESPONSES.spa;
  if (m.includes('food') || m.includes('dine') || m.includes('dinner') || m.includes('chef')) return RESPONSES.dining;
  if (m.includes('villa') || m.includes('bungalow') || m.includes('penthouse')) return RESPONSES.room;
  return RESPONSES.default;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: 0, type: 'bot', text: 'Welcome to Aurum Resort. I\'m your personal concierge. How may I assist you today?' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    const msg = input.trim();
    if (!msg) return;
    setMessages(p => [...p, { id: Date.now(), type: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const pool = getReply(msg);
      const reply = pool[Math.floor(Math.random() * pool.length)];
      setMessages(p => [...p, { id: Date.now() + 1, type: 'bot', text: reply }]);
      setTyping(false);
    }, 900 + Math.random() * 500);
  };

  return (
    <div className={styles.widget}>
      {open && (
        <div className={styles.window}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.onlineDot} />
              <div>
                <div className={styles.name}>Aurum Concierge</div>
                <div className={styles.status}>Available now</div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
          </div>

          <div className={styles.messages}>
            {messages.map(m => (
              <div key={m.id} className={`${styles.msg} ${m.type === 'user' ? styles.user : styles.bot}`}>
                {m.text}
              </div>
            ))}
            {typing && <div className={`${styles.msg} ${styles.bot} ${styles.typing}`}><span />  <span />  <span /></div>}
            <div ref={endRef} />
          </div>

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              placeholder="Ask anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className={styles.sendBtn} onClick={send}>▶</button>
          </div>
        </div>
      )}
      <button className={styles.bubble} onClick={() => setOpen(o => !o)}>
        {open ? '×' : '💬'}
      </button>
    </div>
  );
}
