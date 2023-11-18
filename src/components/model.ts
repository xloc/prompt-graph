export interface XYHW {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface BlockModel extends XYHW {
  x: number;
  y: number;
  width: number;
  height: number;

  id: string;
  title: string;
  prompt: string;

}

