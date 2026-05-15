import React, { useRef } from "react";
import "./ProfileModal.css";

const ProfileModal = ({ isOpen, onClose, profilePhoto, onPhotoChange }) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      onPhotoChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onPhotoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal__header">
          <h2 className="profile-modal__title">Profile photo</h2>
          <button className="profile-modal__close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="profile-modal__body">
          <div className="profile-modal__preview">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="profile-modal__img"
              />
            ) : (
              <div className="profile-modal__placeholder">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    cx="24"
                    cy="20"
                    r="9"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M8 40c0-8.84 7.16-16 16-16s16 7.16 16 16"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="profile-modal__placeholder-label">
                  No photo yet
                </span>
              </div>
            )}
          </div>

          <div className="profile-modal__actions">
            <button
              type="button"
              className="profile-modal__upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePhoto ? "Change photo" : "Upload photo"}
            </button>
            {profilePhoto && (
              <button
                type="button"
                className="profile-modal__remove-btn"
                onClick={handleRemove}
              >
                Remove photo
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="profile-modal__file-input"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
