import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SaveMazeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, isPublic: boolean) => void;
  defaultName?: string;
  defaultDescription?: string;
  defaultIsPublic?: boolean;
}

export default function SaveMazeModal({
  isOpen,
  onClose,
  onSave,
  defaultName = "",
  defaultDescription = "",
  defaultIsPublic = false,
}: SaveMazeModalProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [isPublic, setIsPublic] = useState(defaultIsPublic);

  const handleSave = () => {
    if (name.trim() === "") return;
    onSave(name, description, isPublic);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Maze</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="mazeName">Maze Name</Label>
            <Input
              id="mazeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Maze"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mazeDescription">Description (optional)</Label>
            <Textarea
              id="mazeDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A challenging maze with multiple paths..."
              className="h-24"
            />
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <RadioGroup
              defaultValue={isPublic ? "public" : "private"}
              onValueChange={(value) => setIsPublic(value === "public")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={!name.trim()}>
            Save Maze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
