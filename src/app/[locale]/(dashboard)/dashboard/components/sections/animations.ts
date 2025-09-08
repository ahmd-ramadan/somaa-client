import { Variants } from 'framer-motion';

export const createTickerVariants = (currentY: number, itemCount: number = 10): Variants => {
    // Calculate animation range based on item count
    // Each item is approximately 120px height (including spacing)
    const itemHeight = 120;
    const totalHeight = itemCount * itemHeight;
    
    return {
        animate: {
            y: [0, -totalHeight],
            transition: {
                y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: itemCount * 2, // 2 seconds per item
                    ease: "linear",
                },
            },
        },
        pause: {
            y: currentY,
            transition: {
                duration: 0.1,
            },
        },
    };
};

export const liveAnalysisItemVariants: Variants = {
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.5,
        }
    },
    initial: {
        opacity: 0,
        x: -20,
        scale: 0.9,
    },
    continuous: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const subAnalysisVariants: Variants = {
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        }
    },
    initial: {
        opacity: 0,
        y: 50,
    },
    continuous: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const publisherVariants: Variants = {
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        borderRadius: "50%",
        transition: {
            duration: 0.5,
        }
    },
    initial: {
        opacity: 0,
        x: 100,
        scale: 0.8,
        borderRadius: "8px",
    },
    continuous: {
        x: [100, -100],
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
        }
    }
}; 