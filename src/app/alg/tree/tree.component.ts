import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

interface TreeNode {
  id: string;
  name: string;
  parent: string | null;
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent {
  title = '二叉树可视化';
  treeNodes: TreeNode[] = [];

  constructor() {
    this.generateTree();
  }

  generateTree(): void {
    this.treeNodes = [
      { id: '1', name: '10', parent: null },
      { id: '2', name: '5', parent: '1' },
      { id: '3', name: '15', parent: '1' },
      { id: '4', name: '3', parent: '2' },
      { id: '5', name: '7', parent: '2' },
      { id: '6', name: '12', parent: '3' },
      { id: '7', name: '18', parent: '3' }
    ];
  }

  addNode(): void {
    const newId = (this.treeNodes.length + 1).toString();
    const newValue = Math.floor(Math.random() * 20) + 1;
    this.treeNodes.push({
      id: newId,
      name: newValue.toString(),
      parent: this.treeNodes[0]?.id || null
    });
  }

  getChild(parentId: string, position: 'left' | 'right'): TreeNode | undefined {
    const children = this.treeNodes.filter(n => n.parent === parentId);
    return position === 'left' ? children[0] : children[1];
  }
}