import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const TagBadge = ({ tag, delay = 0 }: { tag: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Badge
      variant="secondary"
      className="bg-muted/50 hover:bg-muted border-0 text-xs px-3 py-1 font-medium transition-colors duration-200 cursor-default"
    >
      {tag}
    </Badge>
  </motion.div>
);

export { TagBadge };
