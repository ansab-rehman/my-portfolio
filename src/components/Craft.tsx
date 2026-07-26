import { craft } from "../content";
import { useReveal } from "../hooks/useReveal";

export function Craft() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      className={`section craft reveal ${visible ? "is-visible" : ""}`}
      id="craft"
      aria-labelledby="craft-heading"
      ref={ref}
    >
      <div className="section__header">
        <p className="section__eyebrow">Skills</p>
        <h2 className="section__title" id="craft-heading">
          Tools I work with
        </h2>
        <p className="section__lede">{craft.intro}</p>
      </div>

      <div className="craft__groups">
        {craft.groups.map((group, gi) => (
          <div
            key={group.label}
            className={`craft__group craft__group--tone-${(gi % 3) + 1}`}
          >
            <h3 className="craft__label">{group.label}</h3>
            <ul className="craft__chips">
              {group.items.map((item) => (
                <li key={item}>
                  <span className="craft__chip">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
