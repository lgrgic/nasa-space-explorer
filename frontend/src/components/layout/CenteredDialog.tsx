import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface CenteredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-6xl translate-x-[-50%] translate-y-[-50%] border border-gray-700 bg-black/90 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export const CenteredDialog = ({
  isOpen,
  onClose,
  children,
  title,
}: CenteredDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="sr-only">{title || "Dialog"}</DialogTitle>

        <DialogDescription className="sr-only">
          {title ? `${title} content` : "Dialog content"}
        </DialogDescription>

        {/* Header */}
        {title && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 bg-black/90 z-10 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
              {title}
            </h2>
            <DialogPrimitive.Close className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors border border-red-500 shadow-lg">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        )}

        {!title && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 bg-black/90 z-10 flex items-center justify-end flex-shrink-0">
            <DialogPrimitive.Close className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors border border-red-500 shadow-lg">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
