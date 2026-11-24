// Built-in content, used when nothing has been edited in /admin yet.
// Keys must match CONTENT_SECTIONS in public/api/_lib.php.
import { projects } from '../data/projects';
import { designWorks, designCategories, videoWorks, videoCategories } from '../data/portfolio';
import { articles } from '../data/posts';
import { testimonials } from '../data/testimonials';
import { faq } from '../data/faq';
import { services } from '../data/services';

export const defaultContent = {
  projects,
  designWorks,
  designCategories,
  videoWorks,
  videoCategories,
  posts: articles,
  testimonials,
  faq,
  services,
};
