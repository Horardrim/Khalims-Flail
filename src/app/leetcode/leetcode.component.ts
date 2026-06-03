import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-leetcode',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './leetcode.component.html',
  styleUrls: ['./leetcode.component.css']
})
export class LeetcodeComponent {}
