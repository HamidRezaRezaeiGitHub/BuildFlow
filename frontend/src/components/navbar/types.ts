// Generic interfaces for navbar components
// These can be easily adapted to any project's user model

export interface GenericContact {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface GenericUser {
  id: string;
  username?: string;
  email?: string;
  contact?: GenericContact;
  // Allow for additional properties that consuming projects may have
  [key: string]: any;
}

export interface NavbarUser {
  // Minimal interface required by navbar components
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
}

// Helper function to adapt different user models to NavbarUser
export const adaptUserForNavbar = (user: GenericUser): NavbarUser => {
  return {
    id: user.id,
    firstName: user.contact?.firstName,
    lastName: user.contact?.lastName,
    email: user.email || user.contact?.email,
    avatarUrl: user.avatarUrl || user.profileImage || user.avatar,
  };
};