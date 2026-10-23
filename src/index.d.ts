export type Animation = 'idle' | 'wave' | 'think' | 'celebrate' | 'point' | 'fold' | 'surprised' | 'sleep';
export type Position = 'bottom-left' | 'bottom-right';
export interface DialogueButton {
  label: string;
  onClick?: (assistant: Waclippy) => unknown;
}
export interface WaclippyOptions {
  message?: string;
  buttons?: DialogueButton[];
  position?: Position;
  visible?: boolean;
}
export interface Waclippy {
  readonly element: HTMLDivElement;
  say(message: string, buttons?: DialogueButton[]): Waclippy;
  animate(animation?: Animation): Waclippy;
  show(): Waclippy;
  hide(): Waclippy;
  setPosition(position: Position): Waclippy;
  destroy(): void;
}
export function createWaclippy(options?: WaclippyOptions): Waclippy;
