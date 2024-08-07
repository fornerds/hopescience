import React from "react";
import "./Modal.css"; // 모달에 대한 스타일 지정
import { Button } from "../../components/Button";

export const Modal = ({ modalTitle, isOpen, children, onClose, onConfirm, confirmLabel, cancelLabel, debug }) => {
  // console.log("Modal render. isOpen:", isOpen);
  
  if (!isOpen) {
    if (debug) console.log("Modal not rendered because isOpen is false");
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {modalTitle ? <h2 className="modal-title">{modalTitle}</h2> : ""}
        {children}
        <div className="modal-buttons-group">
          {onConfirm && (
            <Button
              className="action-button"
              onClick={onConfirm}
              label={confirmLabel || "확인"}
              variant="primary"
            />
          )}
          <Button
            className="close-button"
            onClick={onClose}
            label={cancelLabel || "취소"}
            variant={onConfirm ? "secondary" : "primary"}
          />
        </div>
      </div>
    </div>
  );
};