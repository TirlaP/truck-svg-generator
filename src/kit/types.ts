// Rendering contract shared across bodies, cabs, and freight.
//
// Convention (inside any <g> returned by these components):
//   - Origin (0,0) is at the vehicle's FRONT on the GROUND line.
//   - Positive X extends toward the REAR of the vehicle.
//   - Positive Y points DOWN (standard SVG); to draw above ground use
//     negative Y. Consumers should translate upward using `-(height * scale)`.

import type { FreightSlot, Vehicle } from '../types';

export interface CabRenderProps {
  /** Pixels per metre. */
  scale: number;
  /** How long the cab occupies along the chassis (m). */
  cabLength: number;
  /** "prime-mover" cabs stop at cabLength; "rigid" cabs abut the body. */
  mode: 'prime-mover' | 'rigid';
  /** Optional paint override. */
  color?: string;
  /** Optional accent/secondary colour override. */
  accent?: string;
}

export interface BodyRenderProps {
  /** Pixels per metre. */
  scale: number;
  /** Length of the body along the chassis (m). */
  bodyLength: number;
  /** Deck height above ground (m). */
  deckHeight: number;
  /** Body top height above ground (m). */
  topHeight: number;
  /** Optional freight slots rendered by the body when appropriate. */
  freightSlots?: FreightSlot[];
  /** Optional paint override. */
  color?: string;
  /** Optional accent/trim colour override. */
  accent?: string;
  /** Vehicle reference for body-level tweaks (kind, attachments, etc.). */
  vehicle?: Vehicle;
}

export interface FreightRenderProps {
  /** Pixels per metre. */
  scale: number;
  /** Length available to the freight along the deck (m). */
  length: number;
  /** Deck height above ground (m). */
  deckHeight: number;
  /** Optional label for annotation. */
  label?: string;
}
