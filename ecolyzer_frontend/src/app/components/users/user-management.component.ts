import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { selectAllUsers, selectUsersLoading, selectUsersWithRoleUser } from '../../state/user/user.selectors';
import { Store } from '@ngrx/store';
import { approveUser, deleteUser, loadUsers, updateUserRoles } from '../../state/user/user.actions';
import { User } from '../../model/user.model';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  allUsers$: Observable<User[]> = this.store.select(selectAllUsers);
  users$: Observable<User[]> = this.store.select(selectUsersWithRoleUser);

  loading$: Observable<boolean> = this.store.select(selectUsersLoading);
  selectedUser: User | null = null;
  selectedRoles: string[] = [];
  constructor(private store: Store) {}

  ngOnInit(): void {
    console.log("dispatching loaduser..")
    this.store.dispatch(loadUsers());
    this.users$.subscribe(users => console.log("Users from store: ", users));

  }

  openEditModal(user: User): void {
    this.selectedUser = { ...user };
    this.selectedRoles = [...user.roles];
  }

  closeEditModal(): void {
    this.selectedUser = null;
  }

  onRoleChange(event: Event, role: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedRoles.includes(role)) {
        this.selectedRoles = [...this.selectedRoles, role]; 
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
    console.log("Updated Roles: ", this.selectedRoles); 
  }
  


  onUpdateRoles(): void {
    if (this.selectedUser) {
      this.store.dispatch(updateUserRoles({ id: this.selectedUser.id, roles: this.selectedRoles }));
      this.closeEditModal();
    }
  }
  
  onApproveUser(userId: string): void {
    this.store.dispatch(approveUser({ id: userId }));
  }

  onDeleteUser(userId: string): void{
    this.store.dispatch(deleteUser({id: userId}));
  }

}