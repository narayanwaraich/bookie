import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react"; // Using lucide-react for icons

interface ErrorDisplayProps {
  message: string;
  title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  title = "An Error Occurred",
}) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
