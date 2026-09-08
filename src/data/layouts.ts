import type { LayoutConfig } from '../types/photobooth'

/**
 * Add a new frame later by:
 * 1. Dropping a PNG into public/layouts/
 * 2. Adding a LayoutConfig entry below with matching canvas size + slot rects
 */
export const layouts: LayoutConfig[] = [
  {
    id: 'retro-classic',
    name: 'Retro Classic',
    description: '3-photo vertical strip with checkered borders and vinyl vibes.',
    canvas: {
      width: 3750,
      height: 5625,
    },
    frameSrc: `${import.meta.env.BASE_URL}layouts/retro-classic.png`,
    thumbnailSrc: `${import.meta.env.BASE_URL}layouts/retro-classic.png`,
    slots: [
      { id: 'p1', x: 984, y: 636, width: 1695, height: 1085, fit: 'cover' },
      { id: 'p2', x: 986, y: 2301, width: 1693, height: 1079, fit: 'cover' },
      { id: 'p3', x: 985, y: 3967, width: 1693, height: 1076, fit: 'cover' },
    ],
  },
]

export function getLayoutById(id: string): LayoutConfig | undefined {
  return layouts.find((layout) => layout.id === id)
}
