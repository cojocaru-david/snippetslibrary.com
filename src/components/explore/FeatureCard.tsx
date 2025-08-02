export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) => (
  <div
    className="group space-y-4 p-6 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
    data-aos="fade-up"
    data-aos-delay={delay}
    data-aos-duration="600"
  >
    <div className="relative">
      <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl w-14 h-14 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
    <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
      {title}
    </h4>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);
