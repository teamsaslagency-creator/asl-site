'use client';

import { useState } from 'react';
import { projects } from '@/lib/projects';
import ProjectPreview from './ProjectPreview';
import ArrowIcon from './ArrowIcon';

export default function ProjectsGrid() {
  const [filter, setFilter] = useState('All');
  const [preview, setPreview] = useState<string | null>(null);
  const category = (item: typeof projects[number]) => item.category.includes('Salon') ? 'Beauty' : item.category.split(' / ')[0];
  const shown = projects.filter(item => filter === 'All' || category(item) === filter);
  return <><div className="projects-filters" aria-label="Filter projects">{['All', 'Hospitality', 'Automotive', 'Beauty', 'Food'].map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><p className="projects-count" role="status">{shown.length} {shown.length === 1 ? 'project' : 'projects'}</p><div className="projects-grid">{shown.map(project => <article key={project.id} className="portfolio-project"><button className="portfolio-image" onClick={() => setPreview(project.id)} data-project={project.id} aria-label={`Explore live ${project.name}`}><img src={project.image} alt={project.imageAlt} width={1280} height={720} loading="lazy" /><span>Explore live <ArrowIcon /></span></button><div className="portfolio-project-copy"><p>{project.category} / {project.kind}</p><h2>{project.name}</h2><p>{project.text}</p><div><button onClick={() => setPreview(project.id)} data-project={project.id}>Live preview <span><ArrowIcon /></span></button><a href={project.url} data-project={project.id} target="_blank" rel="noopener noreferrer">Visit website <ArrowIcon /></a></div></div></article>)}</div><ProjectPreview projectId={preview} onClose={() => setPreview(null)} /></>;
}
