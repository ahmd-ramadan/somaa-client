import React from 'react';
import { IAnalysis } from "@/interfaces/analysis.types";
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import ViewAnalysis from '../../Actions/ViewAnalysis';
import EditAnalysis from '../../Actions/EditAnalysis';

interface TableModalsProps {
    isDetailsModalOpen: boolean;
    closeDetailsModal: () => void;
    selectedAnalysisDetails: IAnalysis | null;
    handleSave: (updatedAnalysis: IAnalysis) => void;
    isDeleteModalOpen: boolean;
    closeDeleteModal: () => void;
    handleDelete: () => void;
    isUpdateGroupOfAnalysisModalOpen: boolean;
    closeUpdateGroupOfAnalysisModal: () => void;
    handleUpdateGroupOfAnalysis: () => void;
    isViewModalOpen: boolean;
    closeViewModal: () => void;
    selectedAnalysis: IAnalysis | null;
    updateGroupOfAnalysisStatus: string;
    t: (key: string) => string;
    t2: (key: string) => string;
}

const TableModals: React.FC<TableModalsProps> = ({
    isDetailsModalOpen,
    closeDetailsModal,
    selectedAnalysisDetails,
    handleSave,
    isDeleteModalOpen,
    closeDeleteModal,
    handleDelete,
    isUpdateGroupOfAnalysisModalOpen,
    closeUpdateGroupOfAnalysisModal,
    handleUpdateGroupOfAnalysis,
    isViewModalOpen,
    closeViewModal,
    selectedAnalysis,
    updateGroupOfAnalysisStatus,
    t,
    t2
}) => {
    return (
        <>
            <Modal isOpen={isDetailsModalOpen} closeModal={closeDetailsModal} title={t("editModalTitle")}>
                {selectedAnalysisDetails && (
                    <EditAnalysis
                        analysis={selectedAnalysisDetails}
                        onSave={handleSave}
                        onCancel={closeDetailsModal}
                    />
                )}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal} title={t("deleteAnalysisModalTitle")}>
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

            <Modal isOpen={isUpdateGroupOfAnalysisModalOpen} closeModal={closeUpdateGroupOfAnalysisModal} title={t("updateGroupOfAnalysisModalTitle")}>
                <div className="p-4 space-y-4">
                    <p className="text-primary">{t("groupOfAnalaysisModalPharse")}</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={closeUpdateGroupOfAnalysisModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            {t("cancelBtn")}
                        </button>
                        <button
                            onClick={handleUpdateGroupOfAnalysis}
                            disabled={updateGroupOfAnalysisStatus === 'loading'}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                        >
                            { updateGroupOfAnalysisStatus === 'loading' ? <Spinner /> : t("confirmBtn") }
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                closeModal={closeViewModal}
                title={t("viewAnalysisModalTitle")}
                size="wide"
                maxHeight="max-h-[70vh] lg:max-h-[80vh]"
            >
                { selectedAnalysis && <ViewAnalysis analysis={selectedAnalysis} /> }
            </Modal>
        </>
    );
};

export default TableModals; 