import { memo } from "react";
import { SparklesCore } from "./SparkleBackground";

interface SparkleContainerProps {
    theme: string;
}

const SparkleContainer = memo(({ theme }: SparkleContainerProps) => {
    return (
        <div className="w-full absolute inset-0">
            <SparklesCore
                id="signinsparkles"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor={theme === "dark" ? "#FFFFFF" : "hsl(var(--primary))"}
                speed={0.5}
            />
        </div>
    );
});

SparkleContainer.displayName = "SparkleContainer";

export { SparkleContainer };