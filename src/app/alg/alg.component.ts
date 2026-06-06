import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-alg',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './alg.component.html',
  styleUrls: ['./alg.component.css']
})
export class AlgComponent {
  title = 'Alg 模块';
  isFolderExpanded = true;
  isSubFolderExpanded = true;

  toggleFolder(): void {
    this.isFolderExpanded = !this.isFolderExpanded;
  }

  toggleSubFolder(): void {
    this.isSubFolderExpanded = !this.isSubFolderExpanded;
  }
}