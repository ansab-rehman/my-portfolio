import { profile } from "../content";

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
            className="btn btn--ghost"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
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
