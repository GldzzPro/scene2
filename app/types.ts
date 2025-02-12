export interface Scene {
  id: string;
  number: number;
  name: string;
  duration: number;
}

export interface Transition {
  id: string;
  fromScene: string;
  toScene: string;
  duration: number;
}

export interface ShowData {
  scenes: Scene[];
  transitions: Transition[];
}