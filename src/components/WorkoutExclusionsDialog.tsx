
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const bodyParts = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "forearms", label: "Forearms" },
  { value: "quads", label: "Quadriceps" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "calves", label: "Calves" },
  { value: "glutes", label: "Glutes" },
  { value: "core", label: "Core/Abs" },
  { value: "lower_back", label: "Lower Back" },
  { value: "neck", label: "Neck" },
];

type WorkoutExclusionsDialogProps = {
  open: boolean;
  onClose: () => void;
  excludedBodyParts: string[];
  setExcludedBodyParts: (parts: string[]) => void;
  onConfirm: () => void;
};

const WorkoutExclusionsDialog = ({
  open,
  onClose,
  excludedBodyParts,
  setExcludedBodyParts,
  onConfirm,
}: WorkoutExclusionsDialogProps) => {
  const [localExclusions, setLocalExclusions] = useState<string[]>(excludedBodyParts);

  const handleToggleBodyPart = (bodyPart: string) => {
    if (localExclusions.includes(bodyPart)) {
      setLocalExclusions(localExclusions.filter(part => part !== bodyPart));
    } else {
      setLocalExclusions([...localExclusions, bodyPart]);
    }
  };

  const handleConfirm = () => {
    setExcludedBodyParts(localExclusions);
    onConfirm();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Customize Your Workout</SheetTitle>
          <SheetDescription>
            Select any body parts you want to avoid in today's workout
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <div className="flex flex-wrap gap-2">
            {bodyParts.map((part) => (
              <Button
                key={part.value}
                type="button"
                variant={localExclusions.includes(part.value) ? "default" : "outline"}
                onClick={() => handleToggleBodyPart(part.value)}
                className="text-sm"
              >
                {part.label}
              </Button>
            ))}
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleConfirm}>
            Generate Workout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default WorkoutExclusionsDialog;
