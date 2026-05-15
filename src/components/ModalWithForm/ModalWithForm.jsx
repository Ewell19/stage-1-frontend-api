import React, { useEffect, useRef, useState } from "react";
import "./ModalWithForm.css";
import crossIcon from "../../images/icons/Cross.svg";

const CLOSE_ANIMATION_MS = 300;

const ModalWithForm = ({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  modalClassName = "",
  formClassName = "",
  hideHeader = false,
  disableClose = false,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    let timeoutId;

    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      timeoutId = window.setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, CLOSE_ANIMATION_MS);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isRendered) {
      return undefined;
    }

    const handleFocusIn = (event) => {
      if (!modalRef.current || window.innerWidth > 767) {
        return;
      }

      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (!target.matches("input, textarea, select")) {
        return;
      }

      window.setTimeout(() => {
        target.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 80);
    };

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isRendered]);

  if (!isRendered) return null;

  return (
    <div
      className={`modal-overlay${isClosing ? " modal-overlay--closing" : ""}`}
      onClick={disableClose ? undefined : onClose}
    >
      <div
        className={`modal ${isClosing ? "modal--closing" : ""} ${modalClassName}`.trim()}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {!disableClose && (
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <img
              src={crossIcon}
              alt=""
              aria-hidden="true"
              className="modal__close-icon"
            />
          </button>
        )}
        {!hideHeader && (
          <div className="modal__header">
            <h2 className="modal__title">{title}</h2>
          </div>
        )}
        <form
          className={`modal__form ${formClassName}`.trim()}
          onSubmit={onSubmit}
        >
          {children}
        </form>
      </div>
    </div>
  );
};

export default ModalWithForm;
