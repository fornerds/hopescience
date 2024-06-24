import React from "react";
import "./Modal.css"; // 모달에 대한 스타일 지정
import { Button } from "../../components/Button";

export const Modal = ({ modalTitle, isOpen, children, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {modalTitle ? <h2 className="modal-title">{modalTitle}</h2> : ""}
        {children}
        {onConfirm ? (
          <div className="modal-buttons-group">
            <Button
              className="action-button"
              onClick={onConfirm}
              label="삭제"
              variant="danger"
            />
            <Button
              className="close-button"
              onClick={onClose}
              label="취소"
              variant="primary"
            />
          </div>
        ) : (
          <Button
            className="close-button"
            onClick={onClose}
            label="확인"
            variant="primary"
          />
        )}
      </div>
    </div>
  );
};
