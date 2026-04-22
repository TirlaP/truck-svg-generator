// Data model for Australian truck/trailer combinations.
// All dimensions are in metres; the renderer multiplies by `scale` (px/m).
// Convention: a vehicle's "front" is the kerbside-forward end. In SVG layout
// vehicles are drawn left→right with the front at local x=0.

export type VehicleKind =
  | 'prime-mover' // articulated tractor unit (uses cabType)
  | 'rigid'       // single-chassis truck (uses cabType + bodyType)
  | 'semi-trailer'
  | 'a-trailer'
  | 'b-trailer'
  | 'dog-trailer'
  | 'pig-trailer'
  | 'dolly';

export type CabType =
  | 'cab-over-day'      // flat-front day cab (e.g. Kenworth K200 day)
  | 'cab-over-sleeper'  // flat-front with integrated sleeper (K200 sleeper)
  | 'bonneted-day'      // bonneted day cab (T359 day)
  | 'bonneted-sleeper'  // bonneted with sleeper (T909)
  | 'light-cab-over';   // small rigid cab (Isuzu NPR-style)

export type BodyType =
  | 'flatbed'
  | 'curtain-sider'
  | 'refrigerated'
  | 'tanker'
  | 'tipper'
  | 'skeletal'      // container-carrier skeletal frame
  | 'livestock'
  | 'box-van'
  | 'drop-deck'
  | 'low-loader'
  | 'car-carrier';

export type FreightType =
  | 'container-20'
  | 'container-40'
  | 'container-20-hc'
  | 'container-40-hc'
  | 'pallet-stack'
  | 'drum-stack'
  | 'iso-tank'
  | 'bulk-grain'
  | 'livestock-load'
  | 'machinery'
  | 'crate'
  | 'car'
  | 'pipe-bundle';

export interface AxleGroup {
  /** Number of axles in this group: 1 = single, 2 = tandem, 3 = tri-axle. */
  count: number;
  /** Distance from the vehicle's front to the GROUP CENTRE (m). */
  position: number;
  /** Spacing between axles inside the group (m). Default 1.3. */
  spacing?: number;
  /** Tyre style: 'single' (steer, super-single), 'dual' (drive/trailer duals). */
  tyres?: 'single' | 'dual';
  /** If true, draw as a lift-axle in raised position. */
  lifted?: boolean;
  /** Optional label (e.g. "steer", "drive", "tri-axle"). */
  label?: string;
}

export type AttachmentKind =
  | 'kingpin'
  | 'turntable'      // fifth-wheel
  | 'drawbar-eye'    // front of dog/dolly
  | 'drawbar-hitch'; // rear of rigid truck

export interface Attachment {
  kind: AttachmentKind;
  /** Distance from the vehicle's front to the attachment point (m). */
  position: number;
  /** Mounting height above ground (m). Defaults sensibly by kind. */
  height?: number;
}

export interface FreightSlot {
  /** Offset from the vehicle's front to the start of the slot (m). */
  start: number;
  /** Length of the slot along the deck (m). */
  length: number;
  /** Short label (e.g. "P1", "20'"). */
  label?: string;
  /** If true and `loadType` set, render the specific freight shape. */
  loaded?: boolean;
  /** What kind of freight occupies this slot when loaded. */
  loadType?: FreightType;
}

export interface Vehicle {
  id: string;
  kind: VehicleKind;
  /** Total length of the vehicle (m). */
  length: number;

  /** Prime movers and rigids only. */
  cabType?: CabType;
  /** Rigids and trailers only. */
  bodyType?: BodyType;

  /** Cab length override (m). Used for rigids to set where body begins. */
  cabLength?: number;

  /** Deck height above ground (m) — top of load surface. */
  deckHeight?: number;
  /** Body top height above ground (m) — top of the box/curtain/tank. */
  bodyHeight?: number;

  axles: AxleGroup[];
  attachments?: Attachment[];
  freightSlots?: FreightSlot[];

  /** Optional display label (rendered above vehicle). */
  label?: string;
  /** Optional body colour override. */
  bodyColor?: string;
  /** Optional cab colour override. */
  cabColor?: string;
}

export interface Combination {
  name: string;
  description?: string;
  /** Ordered front-to-back: prime mover/rigid first. */
  vehicles: Vehicle[];
}
