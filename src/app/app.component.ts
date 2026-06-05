import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { navItems, NavItem } from './nav-items';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '快速排序可视化';
  sidebarCollapsed = false;
  navItems = navItems;
  expandedGroups: { [key: string]: boolean } = {};

  constructor() {
    this.navItems.forEach(item => {
      if (item.children?.length) {
        this.expandedGroups[item.path] = true;
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleGroup(path: string): void {
    this.expandedGroups[path] = !this.expandedGroups[path];
  }

  isGroupExpanded(path: string): boolean {
    return this.expandedGroups[path] ?? false;
  }

  getNavItemPath(item: NavItem): string {
    return `/${item.path}`;
  }
}