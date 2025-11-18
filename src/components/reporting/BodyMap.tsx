/**
 * Body Map (SVG silhouette with selectable regions)
 * Remplace le clic approximatif par des zones cliquables réelles sur une silhouette humaine.
 */
import { useEffect, useMemo, useState } from 'react';
import type { BodyMapSelection } from '@/lib/api';
import './BodyMap.css';

interface BodyMapProps {
  onSelect: (points: BodyMapSelection[]) => void;
  selectedPoints?: BodyMapSelection[];
}

type Region = {
  id: string;
  label: string;
  polygon: Array<[number, number]>; // in viewBox coords
};

const VIEW_W = 220;
const VIEW_H = 500;

function polygonCentroid(points: Array<[number, number]>): { x: number; y: number } {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, len = points.length, j = len - 1; i < len; j = i++) {
    const [x0, y0] = points[j];
    const [x1, y1] = points[i];
    const f = x0 * y1 - x1 * y0;
    area += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  area *= 0.5;
  if (area === 0) {
    // fallback to average
    const sx = points.reduce((s, p) => s + p[0], 0) / points.length;
    const sy = points.reduce((s, p) => s + p[1], 0) / points.length;
    return { x: sx, y: sy };
  }
  return { x: cx / (6 * area), y: cy / (6 * area) };
}

export function BodyMap({ onSelect, selectedPoints = [] }: BodyMapProps) {
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // hydrate from selectedPoints if provided
    if (selectedPoints?.length) {
      setSelectedRegions(new Set(selectedPoints.map((p) => p.bodyPart)));
    } else {
      setSelectedRegions(new Set());
    }
  }, [selectedPoints]);

  const regions: Region[] = useMemo(
    () => [
      // Head
      {
        id: 'head',
        label: 'Tête',
        polygon: [
          [110, 40],
          [130, 40],
          [140, 60],
          [130, 80],
          [110, 80],
          [100, 60],
        ],
      },
      // Neck
      {
        id: 'neck',
        label: 'Cou',
        polygon: [
          [110, 82],
          [130, 82],
          [130, 95],
          [110, 95],
        ],
      },
      // Chest
      {
        id: 'chest',
        label: 'Poitrine',
        polygon: [
          [85, 95],
          [155, 95],
          [155, 140],
          [85, 140],
        ],
      },
      // Stomach
      {
        id: 'stomach',
        label: 'Ventre',
        polygon: [
          [90, 140],
          [150, 140],
          [150, 190],
          [90, 190],
        ],
      },
      // Left arm
      {
        id: 'left_arm',
        label: 'Bras gauche',
        polygon: [
          [70, 100],
          [85, 100],
          [85, 180],
          [70, 180],
        ],
      },
      // Right arm
      {
        id: 'right_arm',
        label: 'Bras droit',
        polygon: [
          [155, 100],
          [170, 100],
          [170, 180],
          [155, 180],
        ],
      },
      // Left hand
      {
        id: 'left_hand',
        label: 'Main gauche',
        polygon: [
          [65, 180],
          [85, 180],
          [85, 200],
          [65, 200],
        ],
      },
      // Right hand
      {
        id: 'right_hand',
        label: 'Main droite',
        polygon: [
          [155, 180],
          [175, 180],
          [175, 200],
          [155, 200],
        ],
      },
      // Pelvis/hips
      {
        id: 'hips',
        label: 'Hanches',
        polygon: [
          [90, 190],
          [150, 190],
          [150, 220],
          [90, 220],
        ],
      },
      // Left leg
      {
        id: 'left_leg',
        label: 'Jambe gauche',
        polygon: [
          [95, 220],
          [120, 220],
          [120, 330],
          [95, 330],
        ],
      },
      // Right leg
      {
        id: 'right_leg',
        label: 'Jambe droite',
        polygon: [
          [120, 220],
          [145, 220],
          [145, 330],
          [120, 330],
        ],
      },
      // Left foot
      {
        id: 'left_foot',
        label: 'Pied gauche',
        polygon: [
          [90, 330],
          [120, 330],
          [120, 355],
          [90, 355],
        ],
      },
      // Right foot
      {
        id: 'right_foot',
        label: 'Pied droit',
        polygon: [
          [120, 330],
          [150, 330],
          [150, 355],
          [120, 355],
        ],
      },
    ],
    []
  );

  const isSelected = (id: string) => selectedRegions.has(id);

  const toggleRegion = (region: Region) => {
    const next = new Set(selectedRegions);
    if (next.has(region.id)) {
      next.delete(region.id);
    } else {
      next.add(region.id);
    }
    setSelectedRegions(next);
    // map to BodyMapSelection with centroid as x/y (percentage)
    const selections: BodyMapSelection[] = Array.from(next).map((rid) => {
      const r = regions.find((x) => x.id === rid)!;
      const c = polygonCentroid(r.polygon);
      return {
        bodyPart: rid,
        x: (c.x / VIEW_W) * 100,
        y: (c.y / VIEW_H) * 100,
      };
    });
    onSelect(selections);
  };

  return (
    <div className="body-map-container">
      <div className="body-map-wrapper">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="body-map-svg" role="img" aria-label="Body map">
          {/* silhouette background (simple rounded figure) */}

          {/* interactive regions */}
          {regions.map((r) => (
            <polygon
              key={r.id}
              points={r.polygon.map((p) => p.join(',')).join(' ')}
              className={`body-region ${isSelected(r.id) ? 'selected' : ''}`}
              onClick={() => toggleRegion(r)}
            />
          ))}

          {/* labels for selected regions */}
          {regions.map((r) => {
            if (!isSelected(r.id)) return null;
            const c = polygonCentroid(r.polygon);
            return (
              <text
                key={`${r.id}-label`}
                x={c.x}
                y={c.y}
                textAnchor="middle"
                fontSize="10"
                fill="#dc2626"
                fontWeight="bold"
              >
                {r.label}
              </text>
            );
          })}
        </svg>
      </div>
      {selectedRegions.size > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Zones sélectionnées :</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedRegions).map((rid) => {
              const r = regions.find((x) => x.id === rid)!;
              return (
                <button
                  key={rid}
                  onClick={() => toggleRegion(r)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200"
                >
                  {r.label} ×
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

