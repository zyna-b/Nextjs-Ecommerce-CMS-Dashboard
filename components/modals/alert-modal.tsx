"use client";

import React from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevents hydration mismatch
  }
  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 w-full flex items-center justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
