import React, { useState, useRef, useEffect } from 'react';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
    const [position, setPosition] = useState({ x: 30, y: 30 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                text: "Что бы вы хотели найти в документации?",
                isUser: false
            }]);
        }
    }, [isOpen, messages.length]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            setMessages(prev => [...prev, { text: message, isUser: true }]);
            setMessage('');

            // Имитация ответа бота
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    text: "Я помогу вам найти нужную информацию в документации. Что именно вас интересует?",
                    isUser: false
                }]);
            }, 1000);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isOpen) return;
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !isOpen) return;

        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;

        // Ограничение перемещения в пределах окна
        const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 350);
        const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 500);

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    return (
        <div
            ref={chatRef}
            className={`chat-widget ${isOpen ? 'chat-open' : ''} ${isDragging ? 'chat-dragging' : ''}`}
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 1000
            }}
        >
            {!isOpen ? (
                <button
                    className="chat-toggle-btn"
                    onClick={() => setIsOpen(true)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </button>
            ) : (
                <div className="chat-window">
                    <div
                        className="chat-header"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="chat-title">
                            <span>Помощник по документации</span>
                        </div>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
                            >
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="chat-input-form">
                        <div className="input-container-chat">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Введите ваш вопрос..."
                                className="chat-input"
                            />
                            <button
                                type="submit"
                                className="send-btn"
                                disabled={!message.trim()}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;