import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  user_name: string = '';

  constructor(private authService: AuthService){}
  ngOnInit(): void {
    this.user_name = localStorage.getItem('username')!;
  }

  logout() {
    this.authService.logout();
    toast.success('You have successfully logged out');
  }
}
