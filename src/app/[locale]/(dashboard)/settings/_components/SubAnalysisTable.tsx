import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllSubAnalysis, updateSubAnalysis, addSubAnalysis } from '@/lib/features/subAnalysis/subAnalysisThunks';
import { RootState } from '@/lib/store';
import { Edit, Plus, SearchX } from 'lucide-react';
import EditModal from './EditModal';
import AddSubAnalysisModal from './AddSubAnalysisModal';
import { ISubAnalysis } from '@/interfaces/subAnalysis.types';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDateAndTime';
import Spinner from '@/components/ui/Spinner';

const SubAnalysisTable = () => {
  const t = useTranslations("SettingsPage.SubAnalysisPage");

  const dispatch = useAppDispatch();
  const locale = useLocale();
  const { allSubAnalysis, allSubAnalysisStatus, updateSubAnalysisStatus, addSubAnalysisStatus } = useAppSelector((state: RootState) => state.subAnalysis);
  const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
  const [editingAnalysis, setEditingAnalysis] = useState<ISubAnalysis | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if(allSubAnalysisStatus !== 'succeeded') dispatch(fetchAllSubAnalysis());
  }, [dispatch]);

  // Calculate pagination
  const totalPages = Math.ceil(allSubAnalysis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubAnalysis = allSubAnalysis.slice(startIndex, endIndex);

  const handleEdit = (analysis: ISubAnalysis) => {
    setEditingAnalysis(analysis);
  };

  const handleSave = async (newValue: string) => {
    try {
      if(updateSubAnalysisStatus === 'loading') return null;
      const action = await dispatch(updateSubAnalysis({ token, subAnalysisId: editingAnalysis?._id as string, data: { body: newValue }})) 
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message)
        setEditingAnalysis(null)
      } else {
        toast.error(message)
      }
    } catch(err) {
      toast.error("فشلت عملية  تحديث التحليل")
    }
  };

  const handleAddSubAnalysis = async (analysisBody: string) => {
    try {
      if(addSubAnalysisStatus === 'loading') return null;
      const action = await dispatch(addSubAnalysis({ token, data: { body: analysisBody }}))
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message || 'تم إضافة التحليل بنجاح')
        setIsAddModalOpen(false)
      } else {
        toast.error(message || 'فشلت عملية إضافة التحليل')
      }
    } catch(err) {
      toast.error("فشلت عملية إضافة التحليل")
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold text-gray-900">
         {t("totalShowedSubAnalysis")}: <strong className='text-secondary'>{allSubAnalysis.length}</strong>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          { t("addSubAnalysis") }
        </button>
      </div>

      { allSubAnalysisStatus === 'loading' && 
        <div 
            className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg"
            style={{ minHeight: `calc(100vh - 120px)` }}    
        >
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <Spinner size="100px"/>
            </div>
            <div className="text-xl font-semibold mb-2 text-primary">{t("loadingData")}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{t("fetchingFromDatabase")}</span>
            </div>
        </div>
      }

      { currentSubAnalysis.length === 0 &&
        <div 
            className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg" 
            style={{ minHeight: `calc(100vh - 200px)` }}
        >
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <SearchX className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-xl font-semibold mb-2 text-primary">{t("noDataFound")}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                {/* <FilterX className="w-4 h-4" /> */}
                <span>{t("tryAdjustingFilters")}</span>
            </div>
        </div>
      }

      <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs`}>
        <thead className="text-xs text-primary uppercase bg-primary/20">
          <tr>
            <th scope="col" className="px-3 py-2">{t("subAnalysisBody")}</th>
            <th scope="col" className="px-3 py-2">{t("totalSocialMediaMonitoringCount")}</th>
            <th scope="col" className="px-3 py-2">{t("subAnalysisCreatedAt")}</th>
            <th scope="col" className="px-3 py-2">{t("edit")}</th>
          </tr>
        </thead>
        <tbody>
          { currentSubAnalysis.map((subAnalysis, idx) => (
              <tr key={subAnalysis._id} className="border-b hover:bg-gray-200">
                <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{subAnalysis.body}</th>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {subAnalysis?.socialMediaMonitoringCount.toLocaleString() || 0 }
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {formatDate({ locale: 'ar', date: subAnalysis.createdAt, withTime:  true })}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button 
                    onClick={() => handleEdit(subAnalysis)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit size={16} />
                    <span className="sr-only">تعديل</span>
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("prev")}
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm border rounded-md ${
                currentPage === page
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("next")}
          </button>
        </div>
      )}

      <EditModal
        isOpen={!!editingAnalysis}
        onClose={() => setEditingAnalysis(null)}
        onSave={handleSave}
        title={t("editModalTitle")}
        value={editingAnalysis?.body || ''}
        label={t("subAnalysisBody")}
      />

      <AddSubAnalysisModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSubAnalysis}
        isLoading={addSubAnalysisStatus === 'loading'}
      />
    </>
  )
};

export default SubAnalysisTable; 