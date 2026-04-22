import type { Combination, Vehicle } from '../types';

const XML_PROLOG = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';

/** Convert a live SVG DOM element into a self-contained SVG string with an XML prolog. */
export function svgElementToString(svg: SVGElement): string {
  const clone = svg.cloneNode(true) as SVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!clone.getAttribute('xmlns:xlink')) {
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }
  const serialized = new XMLSerializer().serializeToString(clone);
  return XML_PROLOG + serialized;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Release the object URL asynchronously so the browser has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Trigger a browser download of the SVG string as a .svg file. */
export function downloadSvg(svg: SVGElement, filename: string): void {
  const str = svgElementToString(svg);
  const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
  triggerDownload(blob, filename);
}

function svgToDataUrl(svg: SVGElement): string {
  const str = svgElementToString(svg);
  // Use unescape(encodeURIComponent(...)) to safely base64 UTF-8 content.
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return `data:image/svg+xml;base64,${b64}`;
}

function getSvgPixelSize(svg: SVGElement): { width: number; height: number } {
  const svgEl = svg as SVGSVGElement;
  const vb = svgEl.viewBox?.baseVal;
  if (vb && vb.width > 0 && vb.height > 0) {
    return { width: vb.width, height: vb.height };
  }
  const rect = svgEl.getBoundingClientRect();
  return { width: rect.width || 800, height: rect.height || 300 };
}

/** Rasterise the SVG to PNG at a target width (preserves aspect ratio), and trigger download. */
export function downloadPng(
  svg: SVGElement,
  filename: string,
  targetWidth = 1600,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { width: srcW, height: srcH } = getSvgPixelSize(svg);
    const aspect = srcH / srcW;
    const outW = Math.round(targetWidth);
    const outH = Math.round(targetWidth * aspect);

    const dataUrl = svgToDataUrl(svg);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not obtain 2D canvas context.'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outW, outH);
        ctx.drawImage(img, 0, 0, outW, outH);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob returned null.'));
            return;
          }
          triggerDownload(blob, filename);
          resolve();
        }, 'image/png');
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };
    img.onerror = () => reject(new Error('Failed to load SVG as image.'));
    img.src = dataUrl;
  });
}

/** Serialize combination to formatted JSON and trigger download. */
export function downloadJson(combination: Combination, filename: string): void {
  const json = JSON.stringify(combination, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  triggerDownload(blob, filename);
}

function isVehicleLike(v: unknown): v is Vehicle {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.kind === 'string' &&
    typeof o.length === 'number' &&
    Array.isArray(o.axles)
  );
}

/** Parse a JSON string; return { ok: true, combination } or { ok: false, error }. */
export function parseCombinationJson(
  text: string,
): { ok: true; combination: Combination } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (err) {
    return { ok: false, error: `Invalid JSON: ${(err as Error).message}` };
  }
  if (!data || typeof data !== 'object') {
    return { ok: false, error: 'Expected a JSON object at the root.' };
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.name !== 'string') {
    return { ok: false, error: 'Missing or invalid "name" (expected string).' };
  }
  if (!Array.isArray(obj.vehicles)) {
    return { ok: false, error: 'Missing or invalid "vehicles" (expected array).' };
  }
  for (let i = 0; i < obj.vehicles.length; i++) {
    const v = obj.vehicles[i];
    if (!isVehicleLike(v)) {
      return {
        ok: false,
        error: `Vehicle at index ${i} is missing required fields (id, kind, length, axles).`,
      };
    }
  }
  return { ok: true, combination: obj as unknown as Combination };
}

function base64UrlEncode(str: string): string {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return decodeURIComponent(escape(atob(b64)));
}

/** URL-safe encoding: compresses (json+base64url) the combination. */
export function encodeCombinationToUrl(combination: Combination): string {
  const json = JSON.stringify(combination);
  return base64UrlEncode(json);
}

export function decodeCombinationFromUrl(hash: string): Combination | null {
  try {
    const json = base64UrlDecode(hash);
    const parsed = parseCombinationJson(json);
    return parsed.ok ? parsed.combination : null;
  } catch {
    return null;
  }
}

/** Read the URL hash; if it contains `#c=<encoded>`, return the decoded combination. */
export function readCombinationFromLocation(): Combination | null {
  if (typeof window === 'undefined') return null;
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  const c = params.get('c');
  if (!c) return null;
  return decodeCombinationFromUrl(c);
}

/** Write combination to location.hash as `#c=<encoded>` without reloading the page. */
export function writeCombinationToLocation(combination: Combination): void {
  if (typeof window === 'undefined') return;
  const encoded = encodeCombinationToUrl(combination);
  const newHash = `#c=${encoded}`;
  const { pathname, search } = window.location;
  window.history.replaceState(null, '', `${pathname}${search}${newHash}`);
}

/** Copy a string to clipboard, returning a Promise<boolean> indicating success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
