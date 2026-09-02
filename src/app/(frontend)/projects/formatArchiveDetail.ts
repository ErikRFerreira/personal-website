export function formatProjectsArchiveDetail(projectCount: number) {
  const projectLabel = projectCount === 1 ? 'project' : 'projects'

  return `Selected work / ${String(projectCount).padStart(2, '0')} ${projectLabel}`
}
