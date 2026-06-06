import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-leetcode',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './leetcode.component.html',
  styleUrls: ['./leetcode.component.css']
})
export class LeetcodeComponent {
  isFolderExpanded = true;

  toggleFolder(): void {
    this.isFolderExpanded = !this.isFolderExpanded;
  }
}