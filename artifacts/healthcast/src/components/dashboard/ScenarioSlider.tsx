import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScenarioSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function ScenarioSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (val) => val.toString(),
}: ScenarioSliderProps) {
  return (
    <div className="space-y-4 p-4 rounded-xl surface-gradient border border-border/60 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="w-24">
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="h-8 text-right font-mono text-sm border-primary/20 focus-visible:ring-primary/40"
          />
        </div>
      </div>
      <div className="px-2">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(vals) => onChange(vals[0])}
          className="py-2"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
}