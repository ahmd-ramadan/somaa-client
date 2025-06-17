import Image from "next/image";
import { ReactNode } from "react";

interface IAuthLayoutProps {
    haveGoogleSignIn?: boolean;
    haveBanner?: boolean;
    children: ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
    const generateStars = () => {
        const stars = [];
        for (let i = 0; i < 50; i++) {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.5 + 0.5;
            const animationDelay = Math.random() * 5;
            
            stars.push(
                <div 
                    key={i} 
                    className="absolute rounded-full bg-white animate-twinkle"
                    style={{ 
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        opacity: opacity,
                        animationDelay: `${animationDelay}s`
                    }}
                />
            );
        }
        return stars;
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                {generateStars()}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
                
                {/* Spinning Earth */}
                <div className="absolute -right-[30%] -bottom-[60%] w-[100%] h-[100%] animate-spin-slow">
                    <div className="relative w-full h-full">
                        <Image
                            src="https://i.ytimg.com/vi/VO3HWjRD0AQ/maxresdefault.jpg"
                            alt="Earth"
                            fill
                            className="object-contain opacity-15"
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative min-h-screen w-full flex items-center justify-center p-4">
                <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6 border border-white/20">
                    {/* Logo */}
                    <div className="relative h-20 w-64 mx-auto mb-2">
                        <Image 
                            src="/auth-image.png"
                            alt="OSUS Solutions Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Form Content */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;