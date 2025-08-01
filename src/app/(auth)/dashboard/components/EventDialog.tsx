'use client'

import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Button, TextField, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { DbCalendarEvent } from '@/app/lib/definitions';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: DbCalendarEvent) => void;
  onDelete?: (id: number) => void;
  event?: DbCalendarEvent;
}

const colors = [
  { value: "#2196F3", label: "Blue" },
  { value: "#4CAF50", label: "Green" },
  { value: "#D32F2F", label: "Red" },
  { value: "#FFC107", label: "Yellow" },
  { value: "#9C27B0", label: "Purple" },
  { value: "#000000", label: "Black" },
];

export default function EventDialog({ open, onClose, onSave, onDelete, event }: EventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [finish, setEnd] = useState("");
  const [color, setColor] = useState(colors[0].value);
  const [isDeadline, setIsDeadline] = useState(false);

  useEffect(() => {
    console.log("********** EVENT DIALOG");
    console.log(event);

    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStart(event.start);
      setEnd(event.finish);
      setColor(event.color);
      setIsDeadline(event.is_deadline || false);
    } else {
      const now = new Date();
      setStart(now.toISOString().slice(0, 16));
      setEnd(now.toISOString().slice(0, 16));
      setColor(colors[0].value);
      setTitle("");
      setDescription("");
      setIsDeadline(false);
    }
  }, [event]);

  const handleSave = () => {
    onSave({
      id: event?.id || 0,
      title,
      description,
      start: start,
      finish: finish,
      color,
      is_deadline: isDeadline
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
      <DialogContent className="flex flex-col gap-3 min-w-[300px]">
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <TextField
          label="Start"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          fullWidth
          disabled={isDeadline}
        />
        <TextField
          label="End"
          type="datetime-local"
          value={finish}
          onChange={(e) => setEnd(e.target.value)}
          fullWidth
          disabled={isDeadline}
        />
        <TextField
          select
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          fullWidth
        >
          {colors.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              <span className="w-4 h-4 rounded-full inline-block mr-2" style={{ backgroundColor: c.value }}></span>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDeadline}
              onChange={(e) => setIsDeadline(e.target.checked)}
              color="primary"
            />
          }
          label="Is Deadline"
        />
      </DialogContent>
      <DialogActions>
        {event && onDelete && (
          <Button color="error" onClick={() => onDelete(event.id)}>Delete</Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}