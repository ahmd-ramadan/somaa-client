import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllSectors, updateSector, addSector } from '@/lib/features/sector/sectorThunks';
import { RootState } from '@/lib/store';
import { Edit, FilterX, Plus, SearchX } from 'lucide-react';
import EditModal from './EditModal';
import AddSectorModal from './AddSectorModal';
import { ISector } from '@/interfaces/sector.types';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDateAndTime';
import Spinner from '@/components/ui/Spinner';

const SectorsTable = () => {
  const t = useTranslations("SettingsPage.SectorsPage")
  const locale = useLocale();

  const dispatch = useAppDispatch();
  const { allSectors, allSectorsStatus, updateSectorStatus, addSectorStatus } = useAppSelector((state: RootState) => state.sectors);
  const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
  const [editingSector, setEditingSector] = useState<ISector | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if(allSectorsStatus !== 'succeeded') dispatch(fetchAllSectors());
  }, [dispatch]);

  // Calculate pagination
  const totalPages = Math.ceil(allSectors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSectors = allSectors.slice(startIndex, endIndex);

  const handleEdit = (sector: ISector) => {
    setEditingSector(sector);
  };

  const handleSave = async (newValue: string) => {

    try {
      if(updateSectorStatus === 'loading') return null;
      const action = await dispatch(updateSector({ token, sectorId: editingSector?._id as string, data: { name: newValue }})) 
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message)
        setEditingSector(null)
      } else {
        toast.error(message)
      }
    } catch(err) {
      toast.error("فشلت عملية  تحديث القطاع")
    }
  };

  const handleAddSector = async (sectorName: string) => {
    try {
      if(addSectorStatus === 'loading') return null;
      const action = await dispatch(addSector({ token, data: { name: sectorName }}))
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message || 'تم إضافة القطاع بنجاح')
        setIsAddModalOpen(false)
      } else {
        toast.error(message || 'فشلت عملية إضافة القطاع')
      }
    } catch(err) {
      toast.error("فشلت عملية إضافة القطاع")
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold text-gray-900">
         {t("totalShowedSectors")}: <strong className='text-secondary'>{allSectors.length}</strong>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          { t("addSector") }
        </button>
      </div>

      { allSectorsStatus === 'loading' && 
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

      { currentSectors.length === 0 &&
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

      { currentSectors && currentSectors.length > 0 && 
        <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs`}>
        <thead className="text-xs text-primary uppercase bg-primary/20">
          <tr>
            <th scope="col" className="px-3 py-2">{t("sectorName")}</th>
            <th scope="col" className="px-3 py-2">{t("totalSocialMediaMonitoringCount")}</th>
            <th scope="col" className="px-3 py-2">{t("totalNewsMonitoringCount")}</th>
            <th scope="col" className="px-3 py-2">{t("sectorCreatedAt")}</th>
            <th scope="col" className="px-3 py-2">{t("edit")}</th>
          </tr>
        </thead>
        <tbody>
          { currentSectors.map((sector, idx) => (
              <tr key={sector._id} className="border-b hover:bg-gray-200">
                <th scope="row" className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{sector.name}</th>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {sector?.socialMediaMonitoringCount?.toLocaleString() || 0}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {sector?.newsMonitoringCount?.toLocaleString() || 0 }
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {formatDate({ locale: 'ar', date: sector.createdAt, withTime:  true })}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button 
                    onClick={() => handleEdit(sector)}
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
      }

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
        isOpen={!!editingSector}
        onClose={() => setEditingSector(null)}
        onSave={handleSave}
        title={t("editModalTitle")}
        value={editingSector?.name || ''}
        label={t("sectorName")}
      />

      <AddSectorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSector}
        isLoading={addSectorStatus === 'loading'}
      />
    </>
  );
};

export default SectorsTable; 