import { describe, it, expect } from 'vitest'
import { getDependencies, topologicalSort } from './inference';
import { BlockModel } from './model';

describe('topologicalSort', () => {
  it('should return an empty array when given an empty array of blocks', () => {
    const blocks: BlockModel[] = [];
    const result = topologicalSort(blocks);
    expect(result).toEqual([]);
  });

  it('should return the blocks in topological order when there are no cycles', () => {
    const blocks: BlockModel[] = [
      { id: 'a', prompt: "" },
      { id: 'b', prompt: "{c}" },
      { id: 'c', prompt: "{a}" },
      { id: 'd', prompt: "{b}" },
    ] as any;
    const result = topologicalSort(blocks);
    expect(result.map(i => i.id)).toEqual('a c b d'.split(' '));
  });

  it('should throw an error when a cycle is detected in the graph', () => {
    const blocks: BlockModel[] = [
      { id: 'a', prompt: "{b}" },
      { id: 'b', prompt: "{a}" },
    ] as any;
    expect(() => topologicalSort(blocks)).toThrowError('Cycle detected in the graph.');
  });

  it('should throw an error when a block depends on a non-existent block', () => {
    const blocks: BlockModel[] = [
      { id: 'a', prompt: "{b}" },
    ] as any;
    expect(() => topologicalSort(blocks)).toThrowError('Block {a} depends on {b} but it does not exist.');
  });
});

describe('getDependencies', () => {
  it('should return an empty array when there are no dependencies', () => {
    const block: BlockModel = { id: 'a', prompt: "" } as any;
    const result = getDependencies(block);
    expect(result).toEqual([]);
  });

  it('should return the dependencies when there are dependencies', () => {
    const block: BlockModel = { id: 'a', prompt: "{b} {c} {d}" } as any;
    const result = getDependencies(block);
    expect(result).toEqual('b c d'.split(' '));
  });

  it('should return the dependencies when there are duplicate dependencies', () => {
    const block: BlockModel = { id: 'a', prompt: "{b} {c} {b}" } as any;
    const result = getDependencies(block);
    expect(result.sort()).toEqual('b c'.split(' ').sort());
  });

  it.skip('should ignore dependency when braces are escaped', () => {
    const block: BlockModel = { id: 'a', prompt: "{{a}}" } as any;
    const result = getDependencies(block);
    expect(result).toEqual([]);
  });
});