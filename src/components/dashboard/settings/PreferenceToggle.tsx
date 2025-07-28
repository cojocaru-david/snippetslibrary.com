import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { memo, useCallback } from "react";

const PreferenceToggle = memo<{
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}>(function PreferenceToggle({ title, description, checked, onChange }) {
  const handleChange = useCallback(
    (value: boolean) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-1">
        <Label className="text-sm font-medium">{title}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={handleChange} />
    </div>
  );
});

export default PreferenceToggle;
