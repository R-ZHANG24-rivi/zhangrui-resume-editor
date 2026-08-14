/**
 * PRISM — SPECTRUM DATA
 * The six projects are six wavelengths inside ONE black universe.
 * Layout, typography, grid and glass stay identical by design.
 *
 * 内容（标题 / 色值 / 概述 / 案例拆解）现在全部来自 `cv.js`，
 * 这里只做「视觉身份 + 简历文本」的映射，是薄适配层。
 * 想改文案只改 `cv.js`，不要动组件。
 */

import { CV } from './cv'

export const SPECTRUM = CV.projects.map((p) => ({
  id: p.id,
  index: p.index,
  title: p.title,
  wavelength: p.wavelength,
  // nm values are art-directed, not physically exact — they drive the readout UI
  nm: p.nm,
  color: p.color,
  colorSecondary: p.colorSecondary,
  glow: p.glow,
  // motion character: how this wavelength behaves in the light system
  character: p.character,
  discipline: p.discipline,
  year: p.year,
  role: p.role,
  summary: p.summary,
  cover: null,
  // 案例拆解（点开卡片可见）——直接透传 cv 字段
  overview: p.overview,
  problem: p.problem,
  process: p.process,
  outcome: p.outcome,
}))

/** Neutral white-light identity — used by hero / about / ending. */
export const WHITE_LIGHT = {
  id: 'white',
  color: '#f4f5f7',
  colorSecondary: '#8b5cff',
  glow: 'rgba(244, 245, 247, 0.5)',
  character: { drift: 1.0, dispersion: 1.0, bloom: 1.0, rotation: 1.0 },
}

export const getProject = (id) => SPECTRUM.find((p) => p.id === id) || null
