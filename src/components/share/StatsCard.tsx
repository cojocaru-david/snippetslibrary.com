import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/magicui/number-ticker";

const StatsCard = ({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="group"
  >
    <Card className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <div className="text-2xl font-bold tabular-nums">
              {typeof value === "number" ? (
                <NumberTicker value={value} />
              ) : (
                value
              )}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export { StatsCard };
