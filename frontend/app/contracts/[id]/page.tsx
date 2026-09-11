import { Metadata } from 'next';
import { ContractDetailsView } from '@/features/contracts/components/ContractDetailsView';

interface ContractPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ContractPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Contract #${id} | Banglance Decentralized Escrow`,
    description: 'Cryptographic milestone verification, deliverable submission, and multi-sig escrow tracking.',
  };
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { id } = await params;
  return <ContractDetailsView contractId={id} />;
}
