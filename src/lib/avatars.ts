import { User } from '../types/auth';

export interface DummyAvatar {
  id: string;
  name: string;
  url: string;
  category: 'Casual' | 'Professional' | 'Executive' | '3D Vector';
  description?: string;
}

export const DUMMY_AVATARS: DummyAvatar[] = [
  // Casual & Campus Looks
  {
    id: 'avatar-style-casual-1',
    name: 'Campus Casual 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    category: 'Casual',
    description: 'Natural light campus portrait',
  },
  {
    id: 'avatar-style-casual-2',
    name: 'Campus Casual 2',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    category: 'Casual',
    description: 'Outdoor student headshot',
  },
  {
    id: 'avatar-style-casual-3',
    name: 'Studio Casual',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    category: 'Casual',
    description: 'Warm studio lighting',
  },
  {
    id: 'avatar-style-casual-4',
    name: 'Creative Scholar',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    category: 'Casual',
    description: 'Modern creative headshot',
  },

  // Professional & Academic Looks
  {
    id: 'avatar-style-pro-1',
    name: 'Professional Academic 1',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    category: 'Professional',
    description: 'Formal academic portrait',
  },
  {
    id: 'avatar-style-pro-2',
    name: 'Professional Academic 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    category: 'Professional',
    description: 'Faculty headshot profile',
  },
  {
    id: 'avatar-style-pro-3',
    name: 'Research Faculty',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    category: 'Professional',
    description: 'Research & lecturer style',
  },

  // Executive & Leadership Looks
  {
    id: 'avatar-style-exec-1',
    name: 'Executive Leadership 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    category: 'Executive',
    description: 'Corporate leadership style',
  },
  {
    id: 'avatar-style-exec-2',
    name: 'Executive Leadership 2',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    category: 'Executive',
    description: 'Director profile portrait',
  },
  {
    id: 'avatar-style-exec-3',
    name: 'Formal Administration',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    category: 'Executive',
    description: 'Registrar & administration style',
  },

  // Modern 3D Vector Personas
  {
    id: '3d-avatar-1',
    name: '3D Persona Alpha',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9',
    category: '3D Vector',
    description: 'Minimalist 3D vector illustration',
  },
  {
    id: '3d-avatar-2',
    name: '3D Persona Beta',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sophia&backgroundColor=ffdfbf,ffd5dc',
    category: '3D Vector',
    description: 'Warm 3D vector illustration',
  },
  {
    id: '3d-avatar-3',
    name: '3D Tech Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus&backgroundColor=006666,339696',
    category: '3D Vector',
    description: 'Tech cybernetic vector icon',
  },
];

export const getDefaultAvatarForRole = (role?: string): string => {
  switch (role) {
    case 'ADMIN':
      return DUMMY_AVATARS[7].url; // Executive Leadership
    case 'FACULTY':
      return DUMMY_AVATARS[4].url; // Professional Academic
    case 'STUDENT':
    default:
      return DUMMY_AVATARS[0].url; // Campus Casual
  }
};

export const getUserAvatar = (user: User | null): string => {
  if (user && user.avatarUrl) {
    return user.avatarUrl;
  }
  return getDefaultAvatarForRole(user?.role);
};
