import React from 'react';
import Modal from '@/components/ui/Modal';
import { INews } from '@/interfaces/news.types';
import EditNews from '../../Actions/EditNews';
import ViewNews from '../../Actions/ViewNews';

interface TableModalsProps {
    isDetailsModalOpen: boolean;
    closeDetailsModal: () => void;
    selectedNewsDetails: INews | null;
    handleSave: (updatedNews: INews) => void;
    isDeleteModalOpen: boolean;
    closeDeleteModal: () => void;
    handleDelete: () => void;
    isViewModalOpen: boolean;
    closeViewModal: () => void;
    selectedNews: INews | null;
    t: (key: string) => string;
    t2: (key: string) => string;
}

const TableModals: React.FC<TableModalsProps> = ({
    isDetailsModalOpen,
    closeDetailsModal,
    selectedNewsDetails,
    handleSave,
    isDeleteModalOpen,
    closeDeleteModal,
    handleDelete,
    isViewModalOpen,
    closeViewModal,
    selectedNews,
    t,
    t2
}) => {
    return (
        <>
            <Modal isOpen={isDetailsModalOpen} closeModal={closeDetailsModal} title={t("editModalTitle")}>
                {selectedNewsDetails && (
                    <EditNews
                        news={selectedNewsDetails}
                        onSave={handleSave}
                        onCancel={closeDetailsModal}
                    />
                )}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal} title={t("deleteNewsModalTitle")}>
                <div className="p-4 space-y-4">
                    <p className="text-primary">{t2("deleteModalPharse")}</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            {t2("cancelBtn")}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            {t2("deleteBtn")}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                closeModal={closeViewModal}
                title={t("viewNewsModalTitle")}
            >
                { selectedNews && <ViewNews news={selectedNews} /> }
            </Modal>
        </>
    );
};

export default TableModals; 