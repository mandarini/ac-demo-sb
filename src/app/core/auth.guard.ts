import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

export const adminGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  // Wait for session to be checked
  const session = await supabase.getSession();

  if (!session) {
    // Not authenticated - allow access to show login UI
    return true;
  }

  // Check if user is admin
  if (!supabase.isAdmin()) {
    // Authenticated but not admin - redirect to home
    router.navigate(['/']);
    return false;
  }

  return true;
};
