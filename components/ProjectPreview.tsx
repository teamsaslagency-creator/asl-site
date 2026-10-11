'use client';

import ArrowIcon from './ArrowIcon';

import { useEffect, useRef } from 'react';
import { projects } from '@/lib/projects';

export default function ProjectPreview({ projectId, onClose }: { projectId: string | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const project = projects.find(item => item.id === projectId);
  useEffect(() => {
    if (projectId && !dialog.current?.open) dialog.current?.showModal();
    else if (!projectId && dialog.current?.open) dialog.current.close();
  }, [projectId]);
  return <dialog ref={dialog} className="project-preview-dialog" aria-label={project ? `${project.name} live preview` : 'Project preview'} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    {project && <><div className="project-preview-toolbar"><span>{project.name} <small>Live website</small></span><a href={project.url} target="_blank" rel="noopener noreferrer">Open in new tab <ArrowIcon /></a><button aria-label="Close project preview" onClick={() => dialog.current?.close()}>×</button></div><iframe src={project.url} title={`${project.name} live website`} referrerPolicy="no-referrer" /><p className="preview-note">Explore the live website above. If it cannot load here, open it in a new tab.</p></>}
  </dialog>;
}
