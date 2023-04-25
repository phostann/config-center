export const ensureBasename = (basename: string): void => {
  if (!window.location.pathname.includes(basename)) {
    window.history.replaceState('', '', basename + window.location.pathname)
  }
}
