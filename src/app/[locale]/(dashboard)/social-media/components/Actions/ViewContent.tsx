'use client'

import { IAnalysis } from "@/interfaces/analysis.types";
import PublisherEmbed from "../../../dashboard/components/sections/PublisherEmbed";
import { X } from "lucide-react";
import { forwardRef, useEffect, useRef } from "react";


export interface IVewContentProps {
    analysis: IAnalysis
    onClose: () => void;
}

const ViewContent = ({ analysis, onClose }: IVewContentProps) => {

    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className={`mx-auto fixed inset-0 bg-none backdrop-blur-sm flex items-center justify-center z-50`}>
            <div
                ref={modalRef}
                className={`p-6  w-[90%] md:w-[60%] relative`}
                role="dialog"
                aria-modal="true"
            >
                <X
                    onClick={onClose}
                    width="30px"
                    height="30px"
                    className="mx-auto text-gray-800 hover:pointer hover:text-red-600 transition-colors duration-200"
                />
                <div
                    className="max-h-[80vh] overflow-y-auto scrollbar"
                >
                    <PublisherEmbed 
                        analysis={analysis}
                    />
                </div>
            </div>
        </div>
        
    )
}; 

export default ViewContent;