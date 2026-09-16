import { Metadata } from 'next';
import { PortfolioProjectEditorView } from '@/features/freelancer/components/PortfolioProjectEditorView';

export const metadata: Metadata = {
  title: 'Add Portfolio Project | Banglance',
  description:
    'Add a new portfolio project with drag-and-drop sequenced screenshots to showcase your expertise on Banglance.',
};

export default function NewPortfolioProjectPage() {
  return <PortfolioProjectEditorView />;
}
