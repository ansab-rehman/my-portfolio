import { useId, useState } from "react";
import {
  selectedWork,
  type CaseArchitecture,
  type WorkCase,
} from "../content";
import { useReveal } from "../hooks/useReveal";

function ArchitecturePanel({
  architecture,
  open,
}: {
  architecture: CaseArchitecture;
  open: boolean;
}) {
  const [activeId, setActiveId] = useState(architecture.nodes[0]?.id ?? "");
  const regionId = useId();

  if (!open) return null;

  return (
    <div
      className="case-arch"
      id={regionId}
      role="region"
      aria-label="MemogentAI architecture"
    >
      <p className="case-arch__summary">{architecture.summary}</p>
      <p className="case-arch__flow">
        <span className="case-arch__flow-label">Flow</span>
        {architecture.flow}
      </p>
      <ol className="case-arch__nodes">
        {architecture.nodes.map((node, i) => {
          const active = node.id === activeId;
          return (
            <li
              key={node.id}
              className={`case-arch__node ${active ? "is-active" : ""}`}
            >
              <button
                type="button"
                className="case-arch__node-btn"
                aria-expanded={active}
                onClick={() => setActiveId(node.id)}
              >
                <span className="case-arch__node-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="case-arch__node-label">{node.label}</span>
              </button>
              {active ? (
                <p className="case-arch__node-detail">{node.detail}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CaseBlock({
  index,
  id,
  title,
  context,
  status,
  outcomes,
  tech,
  architecture,
}: {
  index: number;
} & WorkCase) {
  const { ref, visible } = useReveal<HTMLElement>();
  const [archOpen, setArchOpen] = useState(false);
  const archPanelId = useId();
  const num = String(index + 1).padStart(2, "0");
  const tone = (index % 3) + 1;

  return (
    <article
      ref={ref}
      id={id === "memogent" ? "memogent" : undefined}
      className={`case case--tone-${tone} reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="case__meta">
        <span className="case__index">{num}</span>
        {status ? <span className="case__status">{status}</span> : null}
      </div>
      <h3 className="case__title">{title}</h3>
      <p className="case__context">{context}</p>
      <ul className="case__outcomes">
        {outcomes.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="case__tech">
        {tech.split(" · ").map((token) => (
          <span key={token} className="case__tech-chip">
            {token}
          </span>
        ))}
      </p>

      {architecture ? (
        <div className="case__arch-wrap">
          <button
            type="button"
            className="case__arch-toggle"
            aria-expanded={archOpen}
            aria-controls={archPanelId}
            onClick={() => setArchOpen((v) => !v)}
          >
            <span>{archOpen ? "Hide architecture" : "View architecture"}</span>
            <span className="case__arch-toggle-icon" aria-hidden="true">
              {archOpen ? "−" : "+"}
            </span>
          </button>
          <div id={archPanelId}>
            <ArchitecturePanel architecture={architecture} open={archOpen} />
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function SelectedWork() {
  return (
    <section className="section selected" id="work" aria-labelledby="work-heading">
      <div className="section__header">
        <p className="section__eyebrow">Products</p>
        <h2 className="section__title" id="work-heading">
          Things I have built
        </h2>
        <p className="section__lede">
          Products and systems I built, separate from where I worked. Work
          experience covers the employers; this is the work itself.
        </p>
      </div>

      <div className="selected__list">
        {selectedWork.map((item, i) => (
          <CaseBlock key={item.id} index={i} {...item} />
        ))}
      </div>
    </section>
  );
}
