import { motion } from "framer-motion";
import { projects } from "../data/projects";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  return (
    <section id="projects" className="px-5 py-20">
      <SectionHeading eyebrow="What I've built" title="Projects" />

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className={`flex flex-col rounded-3xl border p-6 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 ${
              project.featured
                ? "border-primary-light bg-gradient-to-br from-primary-light/10 to-accent/10"
                : "border-[var(--border)] bg-[var(--surface)]"
            }`}
          >
            {project.featured && (
              <span className="mb-3 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                Featured
              </span>
            )}
            <h3 className="text-xl">{project.title}</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--fg-muted)] leading-relaxed">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--bg-alt)] px-3 py-1 text-xs font-medium text-[var(--fg-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 cursor-pointer text-sm font-semibold text-primary hover:underline"
              >
                View project →
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
