import { Metadata } from 'next';
import { PortfolioProjectEditorView } from '@/features/freelancer/components/PortfolioProjectEditorView';

export const metadata: Metadata = {
  title: 'Edit Portfolio Project | Banglance',
  description:
    'Edit portfolio project details and rearrange showcase screenshots on Banglance.',
};

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioProjectPage({ params }: EditPortfolioPageProps) {
  const { id } = await params;
  return <PortfolioProjectEditorView portfolioItemId={id} />;
}
