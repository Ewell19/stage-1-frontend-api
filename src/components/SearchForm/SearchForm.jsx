import React, { useEffect, useRef, useState } from "react";
import "./SearchForm.css";

const dropdownOptions = [
  "Option 1",
  "Option 2",
  "Option 3",
  "Option 4",
  "Option 5",
  "Option 6",
];

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState("idle");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadTimerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, selectedFile, selectedOption);
    }
    setSearchTerm("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
    }

    setSelectedFile(file);
    setUploadState(file ? "uploading" : "idle");
    setUploadProgress(file ? 0 : 0);

    if (!file) {
      return;
    }

    uploadTimerRef.current = setInterval(() => {
      setUploadProgress((current) => {
        if (current >= 100) {
          clearInterval(uploadTimerRef.current);
          uploadTimerRef.current = null;
          setUploadState("done");
          return 100;
        }

        return Math.min(current + 8, 100);
      });
    }, 80);
  };

  const handleRemoveFile = () => {
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }

    setSelectedFile(null);
    setUploadProgress(0);
    setUploadState("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__dropdown" ref={dropdownRef}>
        <button
          type="button"
          className={`search-form__dropdown-trigger ${isDropdownOpen ? "search-form__dropdown-trigger--open" : ""} ${selectedOption ? "search-form__dropdown-trigger--selected" : ""}`.trim()}
          onClick={() => setIsDropdownOpen((current) => !current)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span>{selectedOption || "Select option"}</span>
          <svg
            className="search-form__dropdown-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="search-form__dropdown-menu" role="listbox">
            {dropdownOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`search-form__dropdown-option ${selectedOption === option ? "search-form__dropdown-option--selected" : ""}`.trim()}
                onClick={() => {
                  setSelectedOption(option);
                  setIsDropdownOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        className="search-form__input"
        placeholder="Search for news..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="search-form__file-shell">
        {uploadState === "idle" && (
          <button
            type="button"
            className="search-form__file-button search-form__file-button--idle"
            onClick={triggerFilePicker}
          >
            <span>Choose file</span>
            <svg
              className="search-form__file-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 17V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 10.5 12 7l3.5 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 13.5c-1.66 0-3-1.34-3-3 0-1.48 1.08-2.72 2.5-2.96A4.99 4.99 0 0 1 12 4.5a5 5 0 0 1 5.5 3.04A3.5 3.5 0 0 1 21 11c0 1.93-1.57 3.5-3.5 3.5H7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {uploadState === "uploading" && (
          <div
            className="search-form__file-button search-form__file-button--uploading"
            style={{
              background: `linear-gradient(90deg, #2f71e5 ${uploadProgress}%, #ffffff ${uploadProgress}%)`,
            }}
          >
            <span className="search-form__file-name">{selectedFile?.name}</span>
            <svg
              className="search-form__file-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 17V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 10.5 12 7l3.5 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 13.5c-1.66 0-3-1.34-3-3 0-1.48 1.08-2.72 2.5-2.96A4.99 4.99 0 0 1 12 4.5a5 5 0 0 1 5.5 3.04A3.5 3.5 0 0 1 21 11c0 1.93-1.57 3.5-3.5 3.5H7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {uploadState === "done" && (
          <div className="search-form__file-button search-form__file-button--done">
            <span className="search-form__file-name">{selectedFile?.name}</span>
            <button
              type="button"
              className="search-form__file-remove"
              aria-label="Remove selected file"
              onClick={handleRemoveFile}
            >
              ×
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          id="search-form-file-input"
          type="file"
          className="search-form__file-input"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" className="search-form__button">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
