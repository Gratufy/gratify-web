import React from 'react';
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
type AlertComponentProps = {
  variant: 'default' | 'destructive';
  icon?: React.ReactNode;
  title: string;
  description: string;
};

function AlertComponent({
  variant,
  icon,
  title,
  description,
}: AlertComponentProps) {
  return (
    <Alert variant={variant}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default AlertComponent;
