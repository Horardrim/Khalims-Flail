import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

@Component({
  selector: 'app-bintree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bintree.component.html',
  styleUrls: ['./bintree.component.css']
})
export class BintreeComponent {
  root: TreeNode | null = null;
  preorderResult: number[] = [];
  inorderResult: number[] = [];
  postorderResult: number[] = [];
  isAnimating = false;
  activeNode: number | null = null;

  constructor() {
    this.buildTree();
    this.updateTraversals();
  }

  buildTree(): void {
    this.root = {
      value: 10,
      left: {
        value: 5,
        left: {
          value: 3,
          left: {
            value: 2,
            left: null,
            right: null
          },
          right: {
            value: 4,
            left: null,
            right: null
          }
        },
        right: {
          value: 7,
          left: null,
          right: null
        }
      },
      right: {
        value: 15,
        left: {
          value: 12,
          left: {
            value: 11,
            left: null,
            right: null
          },
          right: {
            value: 13,
            left: null,
            right: null
          }
        },
        right: {
          value: 18,
          left: null,
          right: null
        }
      }
    };
  }

  preorderTraversal(node: TreeNode | null): number[] {
    if (!node) return [];
    return [node.value, ...this.preorderTraversal(node.left), ...this.preorderTraversal(node.right)];
  }

  inorderTraversal(node: TreeNode | null): number[] {
    if (!node) return [];
    return [...this.inorderTraversal(node.left), node.value, ...this.inorderTraversal(node.right)];
  }

  postorderTraversal(node: TreeNode | null): number[] {
    if (!node) return [];
    return [...this.postorderTraversal(node.left), ...this.postorderTraversal(node.right), node.value];
  }

  updateTraversals(): void {
    this.preorderResult = this.preorderTraversal(this.root);
    this.inorderResult = this.inorderTraversal(this.root);
    this.postorderResult = this.postorderTraversal(this.root);
  }

  animateTraversal(type: 'preorder' | 'inorder' | 'postorder'): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.activeNode = null;

    const results = type === 'preorder' ? this.preorderResult :
                    type === 'inorder' ? this.inorderResult : this.postorderResult;
    
    const elements = document.querySelectorAll(`.${type}-item`);
    elements.forEach((el) => el.classList.remove('active'));

    let index = 0;
    const interval = setInterval(() => {
      if (index > 0 && elements[index - 1]) {
        elements[index - 1].classList.remove('active');
      }
      if (index < elements.length && elements[index]) {
        elements[index].classList.add('active');
        this.activeNode = results[index];
        index++;
      } else {
        clearInterval(interval);
        this.isAnimating = false;
        setTimeout(() => {
          this.activeNode = null;
        }, 500);
      }
    }, 400);
  }

  resetTree(): void {
    this.buildTree();
    this.updateTraversals();
    this.activeNode = null;
    document.querySelectorAll('.traversal-item').forEach(el => el.classList.remove('active'));
  }
}