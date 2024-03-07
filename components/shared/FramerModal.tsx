// Modal.js
"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
const Modal = ({ isOpen, onClose, children }: ModalProps) => {

    const handleBackdropClick = (e: any) => {
        // 如果点击的是背景元素，执行关闭操作
        if (e.target === e.currentTarget) {
            e.preventDefault();
            onClose();
        }
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        zIndex: 100,
                    }}
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        className="h-[700px] w-[480px]  flex justify-center text-white relative"
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        exit={{scale: 0}}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
