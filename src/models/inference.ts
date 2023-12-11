import _ from "lodash";
import { MaybeRef, isRef, ref, watchEffect } from "vue";
import { BlockModel } from "./model";

/**
 * Resolve the depended blocks IDs from the prompt.
 * @param {BlockModel} block - The block to retrieve dependencies from.
 * @returns {string[]} - An array of depended block IDs.
 */
export const getDependencies = (block: BlockModel): string[] => {
  const prompt = block.prompt;
  const matches = prompt.matchAll(/\{(\w+)\}/g);
  return _.uniq([...matches].map(m => m[1]));
};

/**
 * Performs a topological sort on an array of BlockModel objects.
 * 
 * @param blocks - The array of BlockModel objects to be sorted.
 * @returns The sorted array of BlockModel objects.
 * @throws Error if a cycle is detected in the graph or if a block's dependency does not exist.
 */
export const topologicalArgSort = (blocks: BlockModel[]): number[] => {
  const sorted: number[] = [];
  const temporaryMark: boolean[] = _.times(blocks.length, _.constant(false));
  const permanentMark: boolean[] = _.times(blocks.length, _.constant(false));

  const visit = (blockIndex: number) => {
    if (permanentMark[blockIndex]) return; // block is visited and added
    if (temporaryMark[blockIndex]) throw new Error("Cycle detected in the graph.");
    temporaryMark[blockIndex] = true;

    const block = blocks[blockIndex];
    getDependencies(block).forEach(depID => {
      const depIndex = blocks.findIndex(b => b.id === depID);
      if (depIndex === -1)
        throw new Error(`Block {${block.id}} depends on {${depID}} but it does not exist.`);
      visit(depIndex);
    });

    temporaryMark[blockIndex] = false;
    permanentMark[blockIndex] = true;
    sorted.push(blockIndex);
  };

  _.range(blocks.length).forEach(visit);
  return sorted;
}

export const topologicalSort = (blocks: BlockModel[]): BlockModel[] => {
  const sorted = topologicalArgSort(blocks);
  return sorted.map(i => blocks[i]);
}

export const gptInference = (i: number, blocks: BlockModel[]) => {
  throw new Error("Not implemented");
  const block = blocks[i];
  const id2outputs = _(getDependencies(block))
    .map(id => ({ id, output: blocks.find(b => b.id === id)!.output! }))
  const interpoloatedPrompt = block.prompt.replace(/\{(\w+)\}/g, (_, id) => {
    return id2outputs.find(o => o.id === id)!.output;
  });
}

export interface Inference {
  isInferencing: boolean;
  order: BlockModel[] | undefined;
  progress: number;
}

export const useInference = (blocks: MaybeRef<BlockModel[]>) => {
  const infenece = ref<Inference>({
    isInferencing: false,
    order: undefined,
    progress: 0,
  });

  const blocksRef = isRef(blocks) ? blocks : ref(blocks);
  watchEffect(() => {
    if (blocksRef.value) infenece.value.order = topologicalSort(blocksRef.value);
  });

  const doInference = async () => {
    if (infenece.value.progress >= infenece.value.order!.length - 1) return;
    // do inference
    await new Promise(resolve => setTimeout(resolve, 500)); // dummy

    // when finished, increment progress
    infenece.value.progress += 1;
    // if still inferencing, set another timeout
    if (
      infenece.value.progress < infenece.value.order!.length &&
      infenece.value.isInferencing
    ) {
      setTimeout(doInference);
    }
  }
  watchEffect(() => {
    if (infenece.value.isInferencing) {
      setTimeout(doInference);
    }
  });

  return infenece
}