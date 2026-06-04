import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-alg',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './alg.component.html',
  styleUrls: ['./alg.component.css']
})
export class AlgComponent {
  title = 'Alg 模块';
}