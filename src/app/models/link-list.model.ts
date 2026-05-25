import { LinkItem } from './link-item.model';

export interface LinkList {
  id: string;
  slug: string;
  description: string;
  links: LinkItem[];
  published: boolean;
  ownerId: string | null;
  createdAt: string;
}
