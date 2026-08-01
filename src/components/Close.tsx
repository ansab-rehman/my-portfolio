import { profile } from "../content";
import { GitHubIcon, LinkedInIcon } from "./SocialIcons";

export function Close() {
  return (
    <footer className="close" id="contact">
      <div className="close__inner">
        <p className="close__eyebrow">Contact</p>
        <h2 className="close__title">Available for thoughtful collaborations.</h2>
        <div className="close__actions">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a
            className="btn btn--ghost btn--social"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon className="btn__icon" />
            LinkedIn
          </a>
          <a
            className="btn btn--ghost btn--social"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon className="btn__icon" />
            GitHub
          </a>
          <a className="btn btn--ghost" href="/Ansab-Rehman-CV.pdf" download="Ansab-Rehman-CV.pdf">
            Download resume
          </a>
        </div>
        <p className="close__edu">
          {profile.education.degree} · {profile.education.school} ·{" "}
          {profile.education.years}
        </p>
      </div>
      <p className="close__copy">
        <a href="#top" className="close__top">
          Back to top
        </a>
        <span aria-hidden="true"> · </span>
        <span>© {new Date().getFullYear()} {profile.name}</span>
      </p>
    </footer>
  );
}
