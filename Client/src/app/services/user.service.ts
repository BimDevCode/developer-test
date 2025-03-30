import { Injectable } from '@angular/core';
import { apiUrls } from '../../env/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import { UserDto } from '../models/UserDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }
  getUsers(): Observable<UserDto[]> {
    return this.http.get<any[]>(`${apiUrls.usersUrl}`).pipe(
      map(users => {
        const transformedUsers = users.map(user => ({
          ...user,
          registered: user.registered ? new Date(user.registered.replace(' -', '-')) : null,
          balance: parseFloat(user.balance.replace(/[^0-9.-]+/g, '')),
          age:  parseInt(user.age) ,
          iconUrl: `${apiUrls.iconsUrl}${user.iconPath}`,
          }));
        return transformedUsers;
      }),
      catchError((error) => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

}
