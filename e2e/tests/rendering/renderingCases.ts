/**
 * Runs from both the browser and node
 */

import type { Canvas } from 'fabric';

export const renderTests = [
  {
    title: 'polygon boundingbox with skew',
    renderFunction: async function render(
      canvas: Canvas,
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      fabric: typeof import('fabric')
    ) {
      const pts = () => [
        {
          x: 300,
          y: 200,
        },
        {
          x: 440,
          y: 340,
        },
        {
          x: 520,
          y: 220,
        },
        {
          x: 580,
          y: 400,
        },
      ];
      canvas.setDimensions({ width: 450, height: 220 });
      const polygon = new fabric.Polygon(pts(), {
        fill: 'blue',
        skewX: 10,
        strokeWidth: 2,
        stroke: 'red',
      });
      canvas.add(polygon);
      canvas.centerObject(polygon);
      canvas.setActiveObject(polygon);
      canvas.renderAll();
    },
  },
];
