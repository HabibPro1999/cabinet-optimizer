"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Tab {
    id: string;
    label: string;
    mobileLabel: string;
}

interface AnimatedTabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
}

export function AnimatedTabs({
    tabs,
    defaultTab,
    onChange
}: AnimatedTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    return (
        <div className="flex space-x-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                        relative rounded-[--radius] px-3 py-1.5 text-sm font-medium
                        transition focus-visible:outline-2
                        ${activeTab === tab.id
                            ? "text-black relative z-20"
                            : "text-muted-foreground hover:text-foreground/60"
                        }
                    `}
                    style={{
                        WebkitTapHighlightColor: "transparent",
                    }}
                >
                    {activeTab === tab.id && (
                        <motion.span
                            layoutId="bubble"
                            className="absolute inset-0 z-10 bg-white"
                            style={{ borderRadius: "var(--radius)" }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="hidden sm:block relative z-20">{tab.label}</span>
                    <span className="sm:hidden relative z-20">{tab.mobileLabel}</span>
                </button>
            ))}
        </div>
    );
}