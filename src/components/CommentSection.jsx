import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MOCK_COMMENTS = [
  { id: 1, user: 'DeFiGuru', text: 'ETH is definitely hitting $4k. The L2 adoption is crazy right now.', time: '2h ago', avatar: '🛡️', likes: 12, replies: [] },
  { id: 2, user: 'CryptoWhale', text: 'I am taking the NO side. Macro conditions are too uncertain.', time: '5h ago', avatar: '🐳', likes: 5, replies: [] },
  { id: 3, user: 'AlphaSeeker', text: 'LayerZero V3 news will be the catalyst. I am all in on YES.', time: '1d ago', avatar: '🚀', likes: 8, replies: [] },
];

const CommentSection = () => {
  const { isWalletConnected, user } = useAuth();
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      user: user?.name || 'User_' + Math.floor(Math.random()*1000),
      text: newComment,
      time: 'Just now',
      avatar: user?.avatar || '👤',
      likes: 0,
      replies: []
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLike = (id) => {
    setComments(comments.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleReply = (parentId) => {
    if (!replyText.trim()) return;
    
    const reply = {
      id: Date.now(),
      user: user?.name || 'User_' + Math.floor(Math.random()*1000),
      text: replyText,
      time: 'Just now',
      avatar: user?.avatar || '👤',
      likes: 0
    };

    setComments(comments.map(c => 
      c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <div className="card" style={{ marginTop: '2rem', padding: '1.75rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        💬 Comments <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>({comments.length})</span>
      </h3>

      {/* Input Section */}
      <div style={{ marginBottom: '2rem' }}>
        {isWalletConnected || user ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontSize: '1.25rem', overflow: 'hidden'
            }}>
              {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                placeholder="Share your thoughts on this market..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'none',
                  outline: 'none', minHeight: '80px', transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}>
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div style={{
            padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)',
            textAlign: 'center', border: '1px dashed var(--border-color)'
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Only registered users or connected wallets can join the conversation.
            </p>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)' }}>
              Sign in to Comment
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {comments.map((c) => (
          <div key={c.id}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: '1rem', overflow: 'hidden'
              }}>
                {typeof c.avatar === 'string' && c.avatar.startsWith('/') 
                  ? <img src={c.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span>{c.avatar}</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{c.user}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {c.time}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {c.text}
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                  <button 
                    onClick={() => handleLike(c.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    👍 {c.likes > 0 ? c.likes : 'Like'}
                  </button>
                  <button 
                    onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    💬 Reply
                  </button>
                </div>

                {/* Reply Input */}
                {replyingTo === c.id && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <input 
                      autoFocus
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleReply(c.id)}
                      style={{
                        flex: 1, padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                      }}
                    />
                    <button 
                      onClick={() => handleReply(c.id)}
                      className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                      Reply
                    </button>
                  </div>
                )}

                {/* Nested Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div style={{ 
                    marginTop: '1.25rem', paddingLeft: '1.25rem', 
                    borderLeft: '2px solid var(--border-color)',
                    display: 'flex', flexDirection: 'column', gap: '1.25rem' 
                  }}>
                    {c.replies.map(r => (
                      <div key={r.id} style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-tertiary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          fontSize: '0.8rem', overflow: 'hidden'
                        }}>
                          {r.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{r.user}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>• {r.time}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {r.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
