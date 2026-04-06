// src/constants/permissions.js

export const PERMISSIONS = {
  // User/Employee permissions
  VIEW_EMPLOYEES: 'view_employees',
  ADD_EMPLOYEE: 'add_employee',
  EDIT_EMPLOYEE: 'edit_employee',
  DELETE_EMPLOYEE: 'delete_employee',
  
  // Project permissions
  VIEW_PROJECTS: 'view_projects',
  ADD_PROJECT: 'add_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  
  // Task permissions
  VIEW_TASKS: 'view_tasks',
  COMPLETE_TASK: 'complete_task',
  ASSIGN_TASK: 'assign_task',
  EDIT_TASK: 'edit_task',
  
  // Role permissions
  VIEW_ROLES: 'view_roles',
  ADD_ROLE: 'add_role',
  EDIT_ROLE: 'edit_role',
  DELETE_ROLE: 'delete_role',
};

export const PERMISSION_GROUPS = {
  FULL_ACCESS: Object.values(PERMISSIONS),
  
  PROJECTS_ONLY: [
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.ADD_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
  ],
  
  EMPLOYEES_ONLY: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.ADD_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
  ],

  // ✅ Add this group
  TASKS_FULL: [
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.COMPLETE_TASK,
    PERMISSIONS.ASSIGN_TASK,
    PERMISSIONS.EDIT_TASK,
  ],
  
  READ_ONLY: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.VIEW_ROLES,
  ],
};