import HomeExperience from '@/components/HomeExperience';
import ServiceDirectory from '@/components/ServiceDirectory';
import { pageMetadata, seo } from '@/lib/seo';

export const metadata = {
  ...pageMetadata('Website Development & Creative Technology in Sri Lanka', seo.description, '/'),
  // The root page is in the same segment as the template; use an explicit brand title.
  title: { absolute: 'Website Development & Creative Technology in Sri Lanka | ASL' },
};

export default function Home() {
  return <HomeExperience serviceDirectory={<ServiceDirectory />} />;
}
