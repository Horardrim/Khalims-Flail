import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BPlusTreeNode {
  id: string;
  keys: number[];
  children: string[];
  isLeaf: boolean;
  parent: string | null;
  nextLeaf?: string;
}

interface BPlusTreeEdge {
  from: string;
  to: string;
}

@Component({
  selector: 'app-bptree',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bptree.component.html',
  styleUrls: ['./bptree.component.css']
})
export class BptreeComponent {
  title = 'B+ 树可视化';
  order: number = 3;
  inputValue: string = '';
  nodes: BPlusTreeNode[] = [];
  edges: BPlusTreeEdge[] = [];
  height: number = 0;
  private nodeIdCounter = 1;
  hoveredKey: { nodeId: string; keyIndex: number } | null = null;
  selectedKey: { nodeId: string; keyIndex: number } | null = null;
  tooltipPosition = { x: 0, y: 0 };

  constructor() {
    this.resetTree();
  }

  resetTree(): void {
    this.nodes = [];
    this.edges = [];
    this.height = 0;
    this.nodeIdCounter = 1;
    this.hoveredKey = null;
    this.selectedKey = null;
  }

  onKeyHover(nodeId: string, keyIndex: number, event: MouseEvent): void {
    this.hoveredKey = { nodeId, keyIndex };
    this.tooltipPosition = { x: event.clientX, y: event.clientY };
  }

  onKeyLeave(): void {
    this.hoveredKey = null;
  }

  onKeyClick(nodeId: string, keyIndex: number, event: MouseEvent): void {
    event.stopPropagation();
    const newKey = { nodeId, keyIndex };
    if (this.selectedKey?.nodeId === newKey.nodeId && this.selectedKey?.keyIndex === newKey.keyIndex) {
      this.selectedKey = null;
    } else {
      this.selectedKey = newKey;
    }
  }

  onCanvasClick(): void {
    this.selectedKey = null;
  }

  isKeyHovered(nodeId: string, keyIndex: number): boolean {
    return this.hoveredKey?.nodeId === nodeId && this.hoveredKey?.keyIndex === keyIndex;
  }

  isKeySelected(nodeId: string, keyIndex: number): boolean {
    return this.selectedKey?.nodeId === nodeId && this.selectedKey?.keyIndex === keyIndex;
  }

  getHoveredKeyInfo(): { key: number; type: string } | null {
    if (!this.hoveredKey) {
      return null;
    }
    const node = this.getNodeById(this.hoveredKey.nodeId);
    if (!node) {
      return null;
    }
    return {
      key: node.keys[this.hoveredKey.keyIndex],
      type: node.isLeaf ? '叶子节点' : '内部节点'
    };
  }

  insertKey(): void {
    const value = parseInt(this.inputValue);
    if (isNaN(value)) {
      return;
    }
    this.inputValue = '';
    this.insert(value);
  }

  deleteSelectedKey(): void {
    if (!this.selectedKey) {
      return;
    }

    const node = this.getNodeById(this.selectedKey.nodeId);
    if (!node) {
      return;
    }

    const keyToDelete = node.keys[this.selectedKey.keyIndex];
    this.delete(keyToDelete);
    this.selectedKey = null;
  }

  get minKeys(): number {
    return Math.ceil(this.order / 2) - 1;
  }

  delete(value: number): void {
    const leaf = this.findLeaf(value);
    if (!leaf) {
      return;
    }

    const index = leaf.keys.indexOf(value);
    if (index === -1) {
      return;
    }

    leaf.keys.splice(index, 1);

    if (leaf.parent === null) {
      if (leaf.keys.length === 0) {
        this.nodes = [];
        this.height = 0;
      }
      return;
    }

    this.updateParentKeysUpward(leaf);

    if (leaf.keys.length < this.minKeys) {
      this.handleLeafUnderflow(leaf);
    }
  }

  updateParentKeysUpward(leaf: BPlusTreeNode): void {
    let current: BPlusTreeNode | undefined = leaf;
    while (current && current.parent) {
      const parent = this.getNodeById(current.parent);
      if (!parent) {
        break;
      }
      const childIndex = parent.children.indexOf(current.id);
      if (childIndex !== -1 && childIndex < parent.keys.length && current.keys.length > 0) {
        parent.keys[childIndex] = current.keys[current.keys.length - 1];
      }
      current = parent;
    }
  }

  handleLeafUnderflow(leaf: BPlusTreeNode): void {
    const parent = this.getNodeById(leaf.parent!);
    if (!parent) {
      return;
    }

    const childIndex = parent.children.indexOf(leaf.id);
    if (childIndex === -1) {
      return;
    }

    if (childIndex > 0) {
      const leftSibling = this.getNodeById(parent.children[childIndex - 1]);
      if (leftSibling && leftSibling.keys.length > this.minKeys) {
        this.borrowFromLeftLeaf(leaf, leftSibling, parent, childIndex);
        return;
      }
    }

    if (childIndex < parent.children.length - 1) {
      const rightSibling = this.getNodeById(parent.children[childIndex + 1]);
      if (rightSibling && rightSibling.keys.length > this.minKeys) {
        this.borrowFromRightLeaf(leaf, rightSibling, parent, childIndex);
        return;
      }
    }

    if (childIndex > 0) {
      this.mergeLeaves(leaf, parent, childIndex, 'left');
    } else {
      this.mergeLeaves(leaf, parent, childIndex, 'right');
    }
  }

  borrowFromLeftLeaf(leaf: BPlusTreeNode, leftSibling: BPlusTreeNode, parent: BPlusTreeNode, childIndex: number): void {
    const borrowedKey = leftSibling.keys.pop()!;
    leaf.keys.unshift(borrowedKey);
    parent.keys[childIndex - 1] = leftSibling.keys[leftSibling.keys.length - 1];
  }

  borrowFromRightLeaf(leaf: BPlusTreeNode, rightSibling: BPlusTreeNode, parent: BPlusTreeNode, childIndex: number): void {
    const borrowedKey = rightSibling.keys.shift()!;
    leaf.keys.push(borrowedKey);
    parent.keys[childIndex] = leaf.keys[leaf.keys.length - 1];
  }

  mergeLeaves(leaf: BPlusTreeNode, parent: BPlusTreeNode, childIndex: number, direction: 'left' | 'right'): void {
    if (direction === 'left') {
      const leftSibling = this.getNodeById(parent.children[childIndex - 1]);
      if (!leftSibling) {
        return;
      }
      leftSibling.keys.push(...leaf.keys);
      leftSibling.nextLeaf = leaf.nextLeaf;
      this.removeNode(leaf);

      parent.children.splice(childIndex, 1);
      if (childIndex <= parent.keys.length) {
        parent.keys.splice(childIndex - 1, 1);
      }
    } else {
      const rightSibling = this.getNodeById(parent.children[childIndex + 1]);
      if (!rightSibling) {
        return;
      }
      leaf.keys.push(...rightSibling.keys);
      leaf.nextLeaf = rightSibling.nextLeaf;
      this.removeNode(rightSibling);

      parent.children.splice(childIndex + 1, 1);
      if (childIndex < parent.keys.length) {
        parent.keys.splice(childIndex, 1);
      } else {
        parent.keys.splice(childIndex - 1, 1);
      }
      if (leaf.keys.length > 0) {
        if (childIndex < parent.keys.length) {
          parent.keys[childIndex] = leaf.keys[leaf.keys.length - 1];
        } else if (childIndex > 0 && childIndex - 1 < parent.keys.length) {
          parent.keys[childIndex - 1] = leaf.keys[leaf.keys.length - 1];
        }
      }
    }

    if (parent.keys.length === 0) {
      if (parent.parent === null) {
        const remainingChild = this.getNodeById(parent.children[0]);
        if (remainingChild) {
          remainingChild.parent = null;
          this.removeNode(parent);
          this.height--;
        }
      } else {
        this.handleInternalUnderflow(parent);
      }
    } else {
      this.updateParentKeysUpwardForInternal(parent);
    }
  }

  handleInternalUnderflow(node: BPlusTreeNode): void {
    const parent = this.getNodeById(node.parent!);
    if (!parent) {
      return;
    }

    const childIndex = parent.children.indexOf(node.id);
    if (childIndex === -1) {
      return;
    }

    if (childIndex > 0) {
      const leftSibling = this.getNodeById(parent.children[childIndex - 1]);
      if (leftSibling && leftSibling.keys.length > this.minKeys) {
        this.borrowFromLeftInternal(node, leftSibling, parent, childIndex);
        return;
      }
    }

    if (childIndex < parent.children.length - 1) {
      const rightSibling = this.getNodeById(parent.children[childIndex + 1]);
      if (rightSibling && rightSibling.keys.length > this.minKeys) {
        this.borrowFromRightInternal(node, rightSibling, parent, childIndex);
        return;
      }
    }

    if (childIndex > 0) {
      this.mergeInternalNodes(node, parent, childIndex, 'left');
    } else {
      this.mergeInternalNodes(node, parent, childIndex, 'right');
    }
  }

  borrowFromLeftInternal(node: BPlusTreeNode, leftSibling: BPlusTreeNode, parent: BPlusTreeNode, childIndex: number): void {
    const separatorKey = parent.keys[childIndex - 1];
    const borrowedKey = leftSibling.keys.pop()!;
    const borrowedChild = leftSibling.children.pop()!;

    node.keys.unshift(separatorKey);
    node.children.unshift(borrowedChild);

    const borrowedChildNode = this.getNodeById(borrowedChild);
    if (borrowedChildNode) {
      borrowedChildNode.parent = node.id;
    }

    parent.keys[childIndex - 1] = borrowedKey;
  }

  borrowFromRightInternal(node: BPlusTreeNode, rightSibling: BPlusTreeNode, parent: BPlusTreeNode, childIndex: number): void {
    const separatorKey = parent.keys[childIndex];
    const borrowedKey = rightSibling.keys.shift()!;
    const borrowedChild = rightSibling.children.shift()!;

    node.keys.push(separatorKey);
    node.children.push(borrowedChild);

    const borrowedChildNode = this.getNodeById(borrowedChild);
    if (borrowedChildNode) {
      borrowedChildNode.parent = node.id;
    }

    parent.keys[childIndex] = borrowedKey;
  }

  mergeInternalNodes(node: BPlusTreeNode, parent: BPlusTreeNode, childIndex: number, direction: 'left' | 'right'): void {
    if (direction === 'left') {
      const leftSibling = this.getNodeById(parent.children[childIndex - 1]);
      if (!leftSibling) {
        return;
      }

      const separatorKey = parent.keys[childIndex - 1];
      leftSibling.keys.push(separatorKey);
      leftSibling.keys.push(...node.keys);
      leftSibling.children.push(...node.children);

      node.children.forEach(childId => {
        const child = this.getNodeById(childId);
        if (child) {
          child.parent = leftSibling.id;
        }
      });

      this.removeNode(node);

      parent.children.splice(childIndex, 1);
      parent.keys.splice(childIndex - 1, 1);
    } else {
      const rightSibling = this.getNodeById(parent.children[childIndex + 1]);
      if (!rightSibling) {
        return;
      }

      const separatorKey = parent.keys[childIndex];
      node.keys.push(separatorKey);
      node.keys.push(...rightSibling.keys);
      node.children.push(...rightSibling.children);

      rightSibling.children.forEach(childId => {
        const child = this.getNodeById(childId);
        if (child) {
          child.parent = node.id;
        }
      });

      this.removeNode(rightSibling);

      parent.children.splice(childIndex + 1, 1);
      parent.keys.splice(childIndex, 1);
    }

    if (parent.keys.length === 0) {
      if (parent.parent === null) {
        const remainingChild = this.getNodeById(parent.children[0]);
        if (remainingChild) {
          remainingChild.parent = null;
          this.removeNode(parent);
          this.height--;
        }
      } else {
        this.handleInternalUnderflow(parent);
      }
    } else {
      this.updateParentKeysUpwardForInternal(parent);
    }
  }

  updateParentKeysUpwardForInternal(node: BPlusTreeNode): void {
    let current: BPlusTreeNode | undefined = node;
    while (current && current.parent) {
      const parent = this.getNodeById(current.parent);
      if (!parent) {
        break;
      }
      const childIndex = parent.children.indexOf(current.id);
      if (childIndex !== -1 && childIndex < parent.keys.length) {
        parent.keys[childIndex] = this.getMaxKeyInSubtree(current);
      }
      current = parent;
    }
  }

  getMaxKeyInSubtree(node: BPlusTreeNode): number {
    let current = node;
    while (!current.isLeaf) {
      const lastChildId = current.children[current.children.length - 1];
      const child = this.getNodeById(lastChildId);
      if (!child) {
        break;
      }
      current = child;
    }
    return current.keys[current.keys.length - 1];
  }

  removeNode(node: BPlusTreeNode): void {
    const index = this.nodes.findIndex(n => n.id === node.id);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }
  }

  insert(value: number): void {
    if (this.nodes.length === 0) {
      const root: BPlusTreeNode = {
        id: this.generateNodeId(),
        keys: [value],
        children: [],
        isLeaf: true,
        parent: null
      };
      this.nodes.push(root);
      this.height = 1;
      return;
    }

    const leaf = this.findLeaf(value);
    this.insertIntoLeaf(leaf, value);
  }

  generateNodeId(): string {
    return `node-${this.nodeIdCounter++}`;
  }

  findLeaf(value: number): BPlusTreeNode | null {
    let current = this.nodes.find(n => n.parent === null);
    if (!current) {
      return null;
    }
    
    while (!current.isLeaf) {
      let i = 0;
      const keys = current.keys;
      while (i < keys.length && value > keys[i]) {
        i++;
      }
      const children = current.children;
      const childId: string = children[i];
      const child = this.nodes.find(n => n.id === childId);
      if (!child) {
        return null;
      }
      current = child;
    }
    
    return current;
  }

  insertIntoLeaf(leaf: BPlusTreeNode | null, value: number): void {
    if (!leaf) {
      return;
    }
    
    const insertIndex = this.findInsertIndex(leaf.keys, value);
    if (insertIndex < leaf.keys.length && leaf.keys[insertIndex] === value) {
      alert(`值 ${value} 已存在于树中，无法重复插入。`);
      return;
    }
    leaf.keys.splice(insertIndex, 0, value);

    const maxKeys = this.order - 1;
    if (leaf.keys.length <= maxKeys) {
      return;
    }

    this.splitLeaf(leaf);
  }

  findInsertIndex(keys: number[], value: number): number {
    let i = 0;
    while (i < keys.length && value > keys[i]) {
      i++;
    }
    return i;
  }

  splitLeaf(leaf: BPlusTreeNode): void {
    const maxKeys = this.order - 1;
    const mid = Math.floor(maxKeys / 2) + 1;
    
    const rightKeys = leaf.keys.splice(mid);
    const keyToPromote = leaf.keys[leaf.keys.length - 1];
    
    const newLeaf: BPlusTreeNode = {
      id: this.generateNodeId(),
      keys: rightKeys,
      children: [],
      isLeaf: true,
      parent: leaf.parent,
      nextLeaf: leaf.nextLeaf
    };
    this.nodes.push(newLeaf);

    leaf.nextLeaf = newLeaf.id;

    if (leaf.parent === null) {
      this.createNewRoot(leaf, newLeaf, keyToPromote);
    } else {
      const parent = this.nodes.find(n => n.id === leaf.parent);
      if (parent) {
        this.insertIntoInternal(parent, keyToPromote, leaf.id, newLeaf.id);
      }
    }
  }

  createNewRoot(left: BPlusTreeNode, right: BPlusTreeNode, key: number): void {
    const root: BPlusTreeNode = {
      id: this.generateNodeId(),
      keys: [key],
      children: [left.id, right.id],
      isLeaf: false,
      parent: null
    };
    this.nodes.push(root);
    
    left.parent = root.id;
    right.parent = root.id;
    
    this.height++;
  }

  insertIntoInternal(node: BPlusTreeNode, key: number, leftChild: string, rightChild: string): void {
    const leftIndex = node.children.indexOf(leftChild);
    
    node.keys.splice(leftIndex, 0, key);
    node.children.splice(leftIndex + 1, 0, rightChild);

    const rightNode = this.nodes.find(n => n.id === rightChild);
    if (rightNode) {
      rightNode.parent = node.id;
    }

    const maxKeys = this.order - 1;
    if (node.keys.length <= maxKeys) {
      return;
    }

    this.splitInternal(node);
  }

  splitInternal(node: BPlusTreeNode): void {
    const maxKeys = this.order - 1;
    const mid = Math.floor(maxKeys / 2);
    const keyToPromote = node.keys[mid];
    
    const rightKeys = node.keys.splice(mid + 1);
    const rightChildren = node.children.splice(mid + 1);

    const newNode: BPlusTreeNode = {
      id: this.generateNodeId(),
      keys: rightKeys,
      children: rightChildren,
      isLeaf: false,
      parent: node.parent
    };
    this.nodes.push(newNode);

    rightChildren.forEach(childId => {
      const child = this.nodes.find(n => n.id === childId);
      if (child) {
        child.parent = newNode.id;
      }
    });

    if (node.parent === null) {
      this.createNewRoot(node, newNode, keyToPromote);
    } else {
      const parent = this.nodes.find(n => n.id === node.parent);
      if (parent) {
        this.insertIntoInternal(parent, keyToPromote, node.id, newNode.id);
      }
    }
  }

  getScaleFactor(): number {
    if (this.height === 0) return 1;
    
    const maxNodesPerLevel = Math.max(...Array.from({ length: this.height }, (_, i) => 
      this.getNodesInLevelOrder(i + 1).length
    ), 1);
    
    const baseScale = 1;
    const maxScale = 3;
    
    if (maxNodesPerLevel <= 3) {
      return baseScale;
    } else if (maxNodesPerLevel <= 6) {
      return baseScale * 1.2;
    } else if (maxNodesPerLevel <= 10) {
      return baseScale * 1.5;
    } else {
      return Math.min(baseScale * 2, maxScale);
    }
  }

  getCanvasSize(): { width: number; height: number } {
    const scale = this.getScaleFactor();
    const baseWidth = 800;
    const baseHeight = 500;
    
    return {
      width: baseWidth * scale,
      height: baseHeight * scale
    };
  }

  getNodePosition(node: BPlusTreeNode): { x: number; y: number } {
    const level = this.getNodeLevel(node);
    const nodesAtLevel = this.getNodesInLevelOrder(level);
    const index = nodesAtLevel.findIndex(n => n.id === node.id);
    
    const canvasSize = this.getCanvasSize();
    const levelHeight = this.height > 0 ? canvasSize.height / this.height : canvasSize.height;
    
    const x = ((index + 0.5) / Math.max(nodesAtLevel.length, 1)) * canvasSize.width;
    const y = levelHeight * (level - 1) + levelHeight / 2;
    
    return { x, y };
  }

  getNodesInLevelOrder(level: number): BPlusTreeNode[] {
    if (level === 1) {
      return this.nodes.filter(n => n.parent === null);
    }
    
    const parentLevel = this.getNodesInLevelOrder(level - 1);
    const result: BPlusTreeNode[] = [];
    
    parentLevel.forEach(parent => {
      const childrenWithKeys = parent.children.map(childId => {
        const child = this.nodes.find(n => n.id === childId);
        return { child, firstKey: child?.keys[0] ?? Number.MAX_VALUE };
      });
      
      childrenWithKeys.sort((a, b) => a.firstKey - b.firstKey);
      
      childrenWithKeys.forEach(item => {
        if (item.child) {
          result.push(item.child);
        }
      });
    });
    
    return result;
  }

  getNodeLevel(node: BPlusTreeNode): number {
    if (!node || !node.parent) {
      return 1;
    }
    
    let level = 1;
    let currentId: string | null = node.parent;
    
    while (currentId !== null) {
      const parentNode = this.nodes.find(n => n.id === currentId);
      if (!parentNode) {
        break;
      }
      level++;
      currentId = parentNode.parent;
    }
    
    return level;
  }

  getEdges(): BPlusTreeEdge[] {
    const result: BPlusTreeEdge[] = [];
    
    this.nodes.forEach(node => {
      const childrenWithKeys = node.children.map(childId => {
        const child = this.nodes.find(n => n.id === childId);
        return { id: childId, firstKey: child?.keys[0] ?? Number.MAX_VALUE };
      });
      
      const sortedChildren = childrenWithKeys.sort((a, b) => a.firstKey - b.firstKey);
      
      sortedChildren.forEach(child => {
        result.push({ from: node.id, to: child.id });
      });
    });
    
    return result;
  }

  getNodeById(id: string): BPlusTreeNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  getNodeWidth(node: BPlusTreeNode): number {
    const baseWidth = 60;
    const keyWidth = 40;
    return Math.max(baseWidth + node.keys.length * keyWidth, 80);
  }

  getNodeHeight(): number {
    return 50;
  }

  isDeleteEnabled(): boolean {
    if (!this.selectedKey) {
      return false;
    }
    const node = this.getNodeById(this.selectedKey.nodeId);
    return node ? node.isLeaf : false;
  }

  getLineIndices(length: number): number[] {
    const indices: number[] = [];
    for (let i = 1; i < length; i++) {
      indices.push(i);
    }
    return indices;
  }
}