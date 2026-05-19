import React from "react";
import "./About.css";

const About = ({ profilePhoto, onEditPhoto, user }) => {
  return (
    <section className="about">
      <div className="about__container">
        <div className="about__photo-wrap">
          {user ? (
            <button
              type="button"
              className="about__photo-btn"
              onClick={onEditPhoto}
              aria-label="Edit profile photo"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Author"
                  className="about__photo-img"
                />
              ) : (
                <div className="about__photo-placeholder">
                  <svg
                    width="48"
                    height="48"
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
                  <p className="about__photo-caption">
                    Placeholder image.
                    <br />
                    Put an image of yourself here.
                  </p>
                </div>
              )}
              <span className="about__photo-overlay" aria-hidden="true">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="4"
                    stroke="#fff"
                    strokeWidth="1.8"
                  />
                </svg>
                <span className="about__photo-overlay-label">
                  {profilePhoto ? "Change photo" : "Upload photo"}
                </span>
              </span>
            </button>
          ) : (
            <div className="about__photo-btn about__photo-btn--static">
              <div className="about__photo-placeholder">
                <svg
                  width="48"
                  height="48"
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
                <p className="about__photo-caption">
                  Placeholder image.
                  <br />
                  Put an image of yourself here.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="about__body">
          <h2 className="about__title">About the author</h2>
          <p className="about__text">
            This block describes the project author. Here you should indicate
            your name, what you do, and which development technologies you know.
          </p>
          <p className="about__text">
            You can also talk about your experience with TripleTen, what you
            learned there, and how you can help potential customers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
