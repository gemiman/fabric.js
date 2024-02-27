import type { GLProbe } from '../filters/GLProbes/GLProbe';
import type { DOMWindow } from 'jsdom';
import type { TextStyleDeclaration } from '../shapes/Text/StyledText';

export type TCopyPasteData = {
  copiedText?: string;
  copiedTextStyle?: TextStyleDeclaration[];
};
export type TFabricEnv = {
  readonly document: Document;
  readonly window: (Window & typeof globalThis) | DOMWindow;
  readonly isTouchSupported: boolean;
  WebGLProbe: GLProbe;
  dispose(element: Element | OffscreenCanvas): void;
  copyPasteData: TCopyPasteData;
};
