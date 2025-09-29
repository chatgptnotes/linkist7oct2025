// Role-Based Access Control (RBAC) system for Linkist NFC
import React from 'react'
import { AuthUser } from './auth-middleware'

// Define permissions
export enum Permission {
  // Order management
  VIEW_ORDERS = 'view:orders',
  CREATE_ORDERS = 'create:orders',
  UPDATE_ORDERS = 'update:orders',
  DELETE_ORDERS = 'delete:orders',
  
  // Customer management
  VIEW_CUSTOMERS = 'view:customers',
  UPDATE_CUSTOMERS = 'update:customers',
  DELETE_CUSTOMERS = 'delete:customers',
  
  // User management
  VIEW_USERS = 'view:users',
  CREATE_USERS = 'create:users',
  UPDATE_USERS = 'update:users',
  DELETE_USERS = 'delete:users',
  ASSIGN_ROLES = 'assign:roles',
  
  // System management
  VIEW_STATS = 'view:stats',
  VIEW_LOGS = 'view:logs',
  SYSTEM_SETTINGS = 'system:settings',
  
  // Email management
  SEND_EMAILS = 'send:emails',
  VIEW_EMAIL_LOGS = 'view:email_logs',
  
  // File management
  UPLOAD_FILES = 'upload:files',
  DELETE_FILES = 'delete:files',
  VIEW_FILES = 'view:files',
}

// Define roles with their permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  user: [
    Permission.VIEW_ORDERS, // Own orders only
    Permission.UPLOAD_FILES, // Own files only
    Permission.VIEW_FILES,   // Own files only
  ],
  
  moderator: [
    Permission.VIEW_ORDERS,
    Permission.UPDATE_ORDERS,
    Permission.VIEW_CUSTOMERS,
    Permission.UPDATE_CUSTOMERS,
    Permission.VIEW_STATS,
    Permission.SEND_EMAILS,
    Permission.VIEW_EMAIL_LOGS,
    Permission.UPLOAD_FILES,
    Permission.VIEW_FILES,
  ],
  
  admin: [
    // All permissions for admin
    ...Object.values(Permission)
  ]
}

// RBAC helper class
export class RBAC {
  // Check if user has specific permission
  static hasPermission(user: AuthUser | null, permission: Permission): boolean {
    if (!user || !user.role) return false
    
    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    return rolePermissions.includes(permission)
  }

  // Check if user has any of the specified permissions
  static hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission))
  }

  // Check if user has all of the specified permissions
  static hasAllPermissions(user: AuthUser | null, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission))
  }

  // Check if user is admin
  static isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'admin'
  }

  // Check if user is moderator or admin
  static isModerator(user: AuthUser | null): boolean {
    return user?.role === 'moderator' || user?.role === 'admin'
  }

  // Get all permissions for a user
  static getUserPermissions(user: AuthUser | null): Permission[] {
    if (!user || !user.role) return []
    return ROLE_PERMISSIONS[user.role] || []
  }

  // Check if user can access admin panel
  static canAccessAdmin(user: AuthUser | null): boolean {
    return this.hasAnyPermission(user, [
      Permission.VIEW_ORDERS,
      Permission.VIEW_CUSTOMERS,
      Permission.VIEW_STATS,
      Permission.VIEW_USERS
    ]) && (user?.role === 'admin' || user?.role === 'moderator')
  }

  // Validate user access to specific resources
  static canAccessResource(user: AuthUser | null, resource: string, action: string): boolean {
    const permission = `${action}:${resource}` as Permission
    return this.hasPermission(user, permission)
  }

  // Get readable role name
  static getRoleName(role: string): string {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'moderator': return 'Moderator'
      case 'user': return 'User'
      default: return 'Unknown'
    }
  }

  // Get role description
  static getRoleDescription(role: string): string {
    switch (role) {
      case 'admin': 
        return 'Full system access including user management and system settings'
      case 'moderator': 
        return 'Access to order management, customer support, and reporting'
      case 'user': 
        return 'Access to personal account and order management'
      default: 
        return 'No access'
    }
  }
}

// Higher-order function for protecting API routes
export function requirePermission(permission: Permission) {
  return function(handler: (request: any, user: AuthUser) => Promise<Response>) {
    return async function(request: any) {
      try {
        // Get user from request (this would be injected by auth middleware)
        const user = (request as any).user as AuthUser | null
        
        if (!RBAC.hasPermission(user, permission)) {
          return Response.json(
            { error: `Permission denied: ${permission}` },
            { status: 403 }
          )
        }

        return handler(request, user!)
      } catch (error) {
        return Response.json(
          { error: 'Access control error' },
          { status: 500 }
        )
      }
    }
  }
}

// React hook for checking permissions in components
export function usePermissions(user: AuthUser | null) {
  return {
    hasPermission: (permission: Permission) => RBAC.hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) => RBAC.hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) => RBAC.hasAllPermissions(user, permissions),
    isAdmin: () => RBAC.isAdmin(user),
    isModerator: () => RBAC.isModerator(user),
    canAccessAdmin: () => RBAC.canAccessAdmin(user),
    getUserPermissions: () => RBAC.getUserPermissions(user)
  }
}

// Permission guard component for React
export function PermissionGuard({ 
  permission, 
  permissions, 
  requireAll = false,
  user, 
  children, 
  fallback = null 
}: {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  user: AuthUser | null
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  let hasAccess = false

  if (permission) {
    hasAccess = RBAC.hasPermission(user, permission)
  } else if (permissions) {
    hasAccess = requireAll 
      ? RBAC.hasAllPermissions(user, permissions)
      : RBAC.hasAnyPermission(user, permissions)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Admin route guard
export function AdminGuard({ user, children, fallback }: {
  user: AuthUser | null
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return RBAC.canAccessAdmin(user) ? <>{children}</> : <>{fallback}</>
}

// Export permission constants for easy use
export const PERMISSIONS = Permission