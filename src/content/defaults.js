// Built-in content, used when nothing has been edited in /admin yet.
// Keys must match CONTENT_SECTIONS in public/api/_lib.php.
import { projects } from '../data/projects';
import { designWorks, designCategories, videoWorks, videoCategories } from '../data/portfolio';
import { articles } from '../data/posts';
import { testimonials } from '../data/testimonials';
import { faq } from '../data/faq';
import { services } from '../data/services';
import { estimator } from '../data/estimator';
import { booking } from '../data/booking';

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
  estimator,
  // Before/after comparisons for the portfolio page (added from /admin)
  beforeAfter: [],
  booking,
};
