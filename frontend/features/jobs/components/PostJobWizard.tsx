'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createJobSchema, CreateJobFormData } from '../schemas/createJobSchema';
import { jobsApi } from '../api/jobsApi';
import { PostJobStepper } from './PostJobStepper';
import { PostJobBasicsStep } from './PostJobBasicsStep';
import { PostJobSkillsStep } from './PostJobSkillsStep';
import { PostJobBudgetStep } from './PostJobBudgetStep';
import { PostJobPreviewSidebar } from './PostJobPreviewSidebar';

export function PostJobWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: '',
      category: 'DeFi Protocol',
      description: '',
      budget: 5000,
      skills: ['Solidity', 'Foundry'],
    },
    mode: 'onTouched',
  });

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger(['title', 'category', 'description']);
      if (!isValid) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await form.trigger(['skills']);
      if (!isValid) return;
      setCurrentStep(3);
    }
  };

  const onSubmit = async (data: CreateJobFormData) => {
    try {
      setIsSubmitting(true);
      const job = await jobsApi.createJob(data);
      toast.success('Project RFP created successfully!');
      router.push(`/jobs/${job.id}`);
    } catch {
      toast.error('Failed to create job posting. Please ensure you are logged in as a client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full">
      <PostJobStepper currentStep={currentStep} onSelectStep={setCurrentStep} />

      <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
        {/* Main Form Step Area */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {currentStep === 1 && <PostJobBasicsStep form={form} />}
          {currentStep === 2 && <PostJobSkillsStep form={form} />}
          {currentStep === 3 && <PostJobBudgetStep form={form} />}

          {/* Step Navigation Bar */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Previous Step</span>
              </Button>
            ) : <div />}

            {currentStep < 3 ? (
              <Button type="button" variant="primary" size="md" onClick={handleNextStep}>
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Deploying RFP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Publish Project RFP</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Live Sync Preview Sidebar */}
        <PostJobPreviewSidebar form={form} />
      </div>
    </form>
  );
}
