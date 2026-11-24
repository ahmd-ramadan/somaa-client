import React, { useRef } from 'react';
import ClearSearchIcon from '../icons/ClearSearch';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    title?: string;
    bgColor?: string;
    titleColor?: string;
    closeColor?: string;
    children: React.ReactNode;
    maxHeight?: string;
    size?: 'default' | 'wide';
}

const Modal = ({ 
        isOpen, closeModal, 
        title, children, bgColor="#fff", 
        titleColor="var(--color-secondary)", 
        closeColor="#030712",
        maxHeight="max-h-96 lg:max-h-[500px]",
        size="default"
    }: ModalProps
) => {
    const modalRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    return (
        <div className={`mx-auto fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50`}>
            <div
                ref={modalRef}
                className={`p-6 rounded-lg shadow-2xl relative ${size === 'wide' ? 'p-3 w-[95%] md:w-[88%] lg:w-[82%] max-w-6xl h-[95%]' : 'w-[90%] md:w-[60%]'}`}
                style={{ backgroundColor: bgColor }}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-between items-center">
                    <h2 
                        className="text-xl font-semibold"
                        style={{ color: titleColor }}
                    >
                        {title}
                    </h2>
                    <X
                        width="30px"
                        height="30px"
                        color={closeColor}
                        onClick={closeModal}
                        className="hover:pointer hover:text-red-600 transition-colors duration-200"
                    />
                </div>
                <div className={`overflow-y-auto scrollbar p-2 mt-4 text-gray ${maxHeight ? maxHeight : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
