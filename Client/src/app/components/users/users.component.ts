import { AfterViewInit, Component, OnInit, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, map, Observable, startWith  } from 'rxjs';
import { AsyncPipe, CommonModule, NgFor, } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { UserDto } from '../../models/UserDto';
import { apiUrls } from '../../../env/environment';
import { NgbdSortableHeader, SortEvent } from '../../directives/NgbdSortableHeader';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [    
    CommonModule,
    NgbHighlight,
    NgFor,
    NgbdSortableHeader,
    FormsModule,
    AsyncPipe, 
    ReactiveFormsModule, ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> | undefined;

  iconsUrl = apiUrls.iconsUrl;
  filteredUsers$ = new Observable<UserDto[]>();
  
  private users = new BehaviorSubject<UserDto[]>([]);
  users$: Observable<UserDto[]> = this.users.asObservable();

  filter = new FormControl('', { nonNullable: true });

  constructor(public userService: UserService) {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if(this.headers && this.headers.first){
        const nameHeader = this.headers.first;
        nameHeader.direction = 'asc'; 
        nameHeader.sort.emit({ column: nameHeader.sortable, direction: nameHeader.direction });
      }
    });
  }
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users.next(data);
      this.filter.setValue('');
    });
    this.filteredUsers$ = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => this.search(text)),
		);
  }

  search(text: string): UserDto[] {
    const term = text.toLowerCase();
    const afterFiltration = this.users.getValue().filter((user) => {
      return (
        user.name.toLowerCase().includes(term) 
      );
    });
    return afterFiltration;
  }

  resetBalance() {
    this.users.next(this.users.getValue().map(user => ({ ...user, balance: 0 })));
    this.filter.setValue(this.filter.value);
  }

  compare = (v1: string | Date | number, v2: string | Date| number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

  onSort({column, direction }: SortEvent) {
    if(!this.headers) return;
		for (const header of this.headers) {
			if (header.sortable !== column) {
				header.direction = '';
			}
		}
		if (direction !== '' || column !== '') {
			this.filteredUsers$ = this.filteredUsers$.pipe(
        map(users => {
          return [...users].sort((a, b) => {
            const res = this.compare(a[column as keyof UserDto], b[column as keyof UserDto]);
            return direction === 'asc' ? res : -res;
          });
        }));
        this.filter.setValue('');
		}
	}
}



