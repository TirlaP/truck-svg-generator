# SVG Truck Generator

Data-driven React + SVG component that renders Australian truck / trailer
combinations from a simple data model. Icon-quality, scalable, with a
built-in interactive builder, NHVR compliance checker, load calculator,
and SVG / PNG / JSON / share-URL export.

## Features

- **Rendering** — 11 trailer body types (flatbed, curtain-sider,
  refrigerated, tanker, tipper, skeletal, livestock, box-van, drop-deck,
  low-loader, car-carrier), 5 cab variants (cab-over day/sleeper,
  bonneted day/sleeper, light cab-over), 13 freight types
  (20'/40' containers, pallet stacks, drums, ISO tanks, bulk, livestock,
  machinery, crates, cars, pipe bundles).
- **Auto-layout** — vehicles place themselves by matching
  kingpin↔turntable and drawbar-eye↔drawbar-hitch attachments, so any
  valid sequence lays out correctly without manual positioning.
- **Interactive builder** — edit every vehicle, axle, attachment and
  freight slot; add any vehicle kind; reorder / delete with live
  preview.
- **NHVR compliance** — auto-classifies the combination (General-Access
  Semi, Truck & Dog, B-Double GML/HML, B-Triple, A-Double, Road Train
  Type 1/2), validates overall length, coupling validity, dolly
  requirement, freight-slot overflow and per-axle-group mass limits.
- **Load calculator** — tare + freight mass distributed across axle
  groups by lever-arm, with front-axle transfer across couplings.
- **Export / share** — download SVG, rasterise to PNG at 1600px, save
  JSON, upload JSON, copy a share URL (combination encoded in `#c=…`
  hash fragment).
- **Measurement overlays** — per-vehicle wheelbase rule, overall-length
  dimension.

## Usage

```tsx
import { TruckCombination } from './src/TruckCombination';
import { validateCombination } from './src/compliance/rules';
import { computeLoad } from './src/compliance/load';

const report = validateCombination(myCombination);
const load = computeLoad(myCombination);

<TruckCombination combination={myCombination} scale={26} showMeasurements />
```

## Development

```bash
npm install
npm run dev       # Vite dev server on :5173
npm run build     # Type-check + build to dist/
npm run preview   # Preview production build
```

## Data model

```ts
interface Combination {
  name: string;
  description?: string;
  vehicles: Vehicle[];  // front-most first
}

interface Vehicle {
  id: string;
  kind: VehicleKind;    // 'prime-mover' | 'rigid' | 'semi-trailer' | 'a-trailer' | 'b-trailer' | 'dog-trailer' | 'pig-trailer' | 'dolly'
  length: number;       // metres
  cabType?: CabType;    // prime-movers and rigids
  bodyType?: BodyType;  // rigids and trailers
  axles: AxleGroup[];
  attachments?: Attachment[];
  freightSlots?: FreightSlot[];
  // … and a few style / override fields
}
```

See [`src/types.ts`](src/types.ts) for the full schema and
[`src/presets.ts`](src/presets.ts) / [`src/templates/pbs.ts`](src/templates/pbs.ts)
for factory-style examples.

## Project layout

```
src/
  types.ts                   main data model
  presets.ts                 visual preset combinations
  templates/pbs.ts           PBS / NHVR-compliant templates
  TruckCombination.tsx       main renderer (forwardRef'd SVG)
  App.tsx                    demo harness with Preview / Builder / Compliance tabs

  kit/
    palette.ts               shared colour tokens
    primitives.tsx           Wheels, Chassis, MudFlap, MarkerLight,
                             LandingLegs, ExhaustStack, KingpinMarker,
                             TurntableMarker, GroundShadow, …
    types.ts                 rendering-contract types

  bodies/                    one .tsx per BodyType + index.ts registry
  cabs/                      one .tsx per CabType + index.ts registry
  freight/                   one .tsx per FreightType + index.ts registry

  builder/                   interactive builder (Builder, VehicleEditor,
                             FreightSlotEditor)
  compliance/                rules.ts, load.ts, ComplianceReport.tsx
  io/                        exporters.ts, ExportBar.tsx,
                             useCombinationUrlSync.ts
```
