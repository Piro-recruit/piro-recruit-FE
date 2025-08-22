import React from 'react';
import { Mail, Send, Users as UsersIcon, Type, MessageCircle } from 'lucide-react';
import '../../../common/CommonModals.css';

const EmailModal = ({ 
  isOpen, 
  onClose, 
  emailContent, 
  onEmailContentChange, 
  onSendEmail, 
  isEmailSending, 
  subscriberCount 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay email-modal-overlay" onClick={onClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
        <div className="email-modal-header">
          <div className="email-header-content">
            <div className="email-header-icon">
              <Mail size={20} />
            </div>
            <div className="email-header-text">
              <h2>일괄 이메일 전송</h2>
              <p>리쿠르팅 알림 신청자들에게 이메일을 보내세요</p>
            </div>
          </div>
          <button className="email-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="bulk-email-modal-body">
          <div className="bulk-email-form">
            <div className="bulk-email-recipients-card">
              <div className="bulk-recipients-header">
                <div className='bulk-recipients-logo'>
                <UsersIcon size={20} />
                <span>수신자 정보</span>
                </div>
                <span className="bulk-count-badge">예상 수신자: {subscriberCount}명</span>
              </div>
              <p>이 이메일은 <strong>리쿠르팅 알림을 신청한 모든 사용자</strong>에게 전송됩니다.</p>
            </div>
            
            <div className="bulk-email-field-group">
              <div className="bulk-email-field">
                <div className="bulk-field-label">
                  <Type size={16} />
                  <label htmlFor="bulk-email-subject">제목</label>
                </div>
                <div className="bulk-input-wrapper">
                  <input
                    id="bulk-email-subject"
                    type="text"
                    value={emailContent.subject}
                    onChange={(e) => onEmailContentChange('subject', e.target.value)}
                    placeholder="예: [피로그래밍] 2025년 전반기 모집 공지"
                    className="bulk-email-input"
                  />
                </div>
              </div>
              
              <div className="bulk-email-field">
                <div className="bulk-field-label">
                  <MessageCircle size={16} />
                  <label htmlFor="bulk-email-message">내용</label>
                </div>
                <div className="bulk-input-wrapper">
                  <textarea
                    id="bulk-email-message"
                    value={emailContent.message}
                    onChange={(e) => {
                      onEmailContentChange('message', e.target.value);
                      // 자동 높이 조절
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.max(160, e.target.scrollHeight) + 'px';
                    }}
                    placeholder="안녕하세요, 피로그래밍입니다.&#10;&#10;2025년 전반기 모집이 시작되어 안내드립니다.&#10;&#10;자세한 내용은 아래를 확인해주세요."
                    className="bulk-email-textarea"
                    rows={6}
                    style={{ minHeight: '160px' }}
                  />
                  <div className="bulk-textarea-footer">
                    <span className="bulk-char-count">
                      {emailContent.message.length} / 2000자
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="email-modal-footer">
          <div className="footer-info">
            <span className="send-time">전송 예정: 즉시</span>
          </div>
          <div className="footer-actions">
            <button className="email-cancel-btn" onClick={onClose}>
              취소
            </button>
            <button 
              className="email-send-btn" 
              onClick={onSendEmail}
              disabled={!emailContent.subject.trim() || !emailContent.message.trim() || isEmailSending}
            >
              <Send size={16} />
              <span>{isEmailSending ? '전송 중...' : '전송하기'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;