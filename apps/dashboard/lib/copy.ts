export const copy = {
  brand: {
    name: "TechLead",
    logo: "TL",
  },
  sidebar: {
    sections: {
      project: "Proyecto",
      view: "Vista",
      team: "Equipo",
    },
    projects: [
      { slug: "platform-core", count: 12 },
      { slug: "data-mesh", count: 5 },
      { slug: "mobile-suite", count: 3 },
    ] as const,
    views: [
      { slug: "pipelines", label: "Pipelines" },
      { slug: "mrs", label: "Merge Requests", count: 10 },
      { slug: "branches", label: "Ramas" },
      { slug: "activity", label: "Actividad" },
    ] as const,
    teams: ["backend", "frontend", "platform", "data"] as const,
  },
  topbar: {
    breadcrumb: ["Workspace", "sngular", "platform-core", "Pipelines"] as const,
    searchPlaceholder: "Buscar repo, MR, autor, rama…",
    newPipeline: "New pipeline",
    liveLabel: "live",
    iconTitles: {
      refresh: "Refresh",
      filter: "Filter",
      theme: "Theme",
    },
  },
  attention: {
    heading: "Necesita atención",
    pipelinesRed: "pipelines rojas",
    running: "corriendo",
    blockedMrs: "MRs bloqueadas",
    staleMrs: "MRs viejas (>5d)",
    updatedSuffix: "actualizado hace 12s",
  },
  tweaks: {
    heading: "Tweaks",
    theme: "Theme",
    density: "Densidad",
    showMRs: "Mostrar MRs",
    cardSize: "Tamaño tarjeta",
    paperGrid: "Grid papel",
    toggleOn: "on",
    toggleOff: "off",
  },
  variations: {
    v1: {
      label: "V1 · Repo cards",
      sub: "layout por defecto",
      heading: "Repos & pipelines",
    },
    v2: {
      label: "V2 · Heatmap",
      sub: "matriz repo × tiempo",
      heading: "Matriz repos × tiempo",
    },
    v3: {
      label: "V3 · Kanban status",
      sub: "fails / running / passed",
      heading: "Tablero por estado",
    },
    v4: {
      label: "V4 · Tabla GitLab",
      sub: "lista densa estilo GitLab",
      heading: "Todas las pipelines",
    },
    v5: {
      label: "V5 · Timeline 24h",
      sub: "actividad temporal",
      heading: "Timeline de pipelines",
    },
  },
  footer: {
    wireframeNote:
      "Wireframe — Tech Lead Dashboard.",
    wireframeBody:
      "5 variaciones low-fi. Cambia entre ellas con las pestañas. Todo mockado; datos hardcoded. Toggle tema con el ☀/☾ arriba a la derecha. Más ajustes en el panel Tweaks.",
  },
} as const

export type Copy = typeof copy
