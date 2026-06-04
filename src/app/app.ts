import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster, HttpClientModule],
  templateUrl: './app.html',
})
export class App {
 
}
