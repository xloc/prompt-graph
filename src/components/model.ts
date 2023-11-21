import YAML from 'yaml'

export interface XYHW {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface BlockModel {
  xyhw: XYHW;

  id: string;
  title: string;
  prompt: string;
}

export const dump = (block: BlockModel[]) => {
  console.log(block);
  return YAML.stringify(block, { indent: 2 });
};

export const load = (yaml: string) => {
  const block = YAML.parse(yaml) as BlockModel[];
  console.log(block);
  return block;
};

